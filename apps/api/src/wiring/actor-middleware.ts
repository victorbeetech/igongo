/**
 * Works out who is calling. When the request carries a session (cookie from
 * the web, or `Authorization: Bearer` from the app), Better Auth checks it,
 * and Roles & Permissions adds what the person may do. The result is
 * `c.var.actor`; modules trust only that.
 */

import type { MiddlewareHandler } from "hono";
import type { ApiEnv } from "../shell/api-env";

export const actorMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  c.set("actor", undefined);
  const headers = c.req.raw.headers;
  // Skip the work for anonymous requests (the public pages, health checks).
  if (headers.get("cookie")?.includes("session_token") || headers.get("authorization")?.startsWith("Bearer ")) {
    const services = c.var.services;
    const session = await (await services.auth()).api.getSession({ headers });
    if (session) {
      c.set("actor", {
        userId: session.user.id,
        sessionId: session.session.id,
        name: session.user.name,
        email: session.user.email,
        access: await services.access().profileFor(session.user.id),
      });
    }
  }
  await next();
};
