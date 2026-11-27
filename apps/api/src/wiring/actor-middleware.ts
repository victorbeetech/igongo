/**
 * Works out who is calling. When the request carries a session (cookie from
 * the web, or `Authorization: Bearer` from the app), Better Auth checks it,
 * and Roles & Permissions adds what the person may do. The result is
 * `c.var.actor`; modules trust only that.
 *
 * Then Users & Login's request gate applies the access rules to every
 * signed-in request (see modules/users-login/src/domain/request-gate.ts):
 * guests are refused on the staff web portal, staff web sessions are kept
 * short, and the super admin must turn on 2-step first. A refused session
 * on the web is signed out on the server at once.
 */

import type { MiddlewareHandler } from "hono";
import { isOwnerSettingUp, requestGate, surfaceOf } from "@igongo/users-login";
import type { ApiEnv } from "../shell/api-env";

export const actorMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  c.set("actor", undefined);
  const headers = c.req.raw.headers;
  // Skip the work for anonymous requests (the public pages, health checks).
  if (headers.get("cookie")?.includes("session_token") || headers.get("authorization")?.startsWith("Bearer ")) {
    const services = c.var.services;
    const session = await (await services.auth()).api.getSession({ headers });
    if (session) {
      const access = await services.access().profileFor(session.user.id);
      // 1. The access rules, before any route sees the caller.
      const user = session.user as typeof session.user & { kind?: string; twoFactorEnabled?: boolean | null };
      const surface = surfaceOf(headers, services.config.webOrigins);
      const kind = user.kind ?? "client";
      const verdict = requestGate(
        {
          surface,
          path: c.req.path,
          account: { kind, email: user.email, twoFactorEnabled: user.twoFactorEnabled === true },
          roleKeys: access.roles.map((r) => r.key),
          // The web portal also needs a staff role given by the super admin.
          hasStaffRole: access.roles.some((r) => r.isStaff),
          sessionCreatedAt: new Date(session.session.createdAt),
          now: services.now,
          // Only looked up when it can matter: a non-staff account on the web.
          ownerSettingUp: surface === "web" && kind !== "staff" && (await isOwnerSettingUp({ access: services.access(), bootstrapEmail: services.bootstrapEmail }, user.email)),
        },
        await services.loginSettings().policy(),
      );
      if (!verdict.allow) {
        if (verdict.endSession) await services.accounts().deleteSession(session.user.id, session.session.id);
        return c.json({ error: verdict.code, message: verdict.message, requestId: c.var.requestId }, verdict.status);
      }
      // 2. The caller, for the modules.
      c.set("actor", { userId: session.user.id, sessionId: session.session.id, name: session.user.name, email: session.user.email, access });
    }
  }
  await next();
};
