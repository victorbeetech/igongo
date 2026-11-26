/**
 * Security routes, mounted by the gateway at `/api/security`.
 *
 * For the super admin (sign-in and security settings are edited at
 * `/api/login-methods/policy`; the sign-in log is the Audit Trail filtered
 * to `users-login`):
 *   GET  /overview         super admins, warnings and the policy
 *   POST /staff-match      make a verified guest account staff, by staff record
 *
 * For everyone signed in (open even before 2-step is on):
 *   GET  /me/settings      what the web portal needs: idle sign-out minutes
 *   POST /me/password      add a first password to a Google or Apple account
 *   GET  /me/export        download my data
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { actorOf, AppError, requirePermission, type ActorEnv } from "@igongo/core";
import { exportMyData } from "../application/use-cases/export-my-data";
import { matchStaffRecord } from "../application/use-cases/match-staff-record";
import { securityOverview } from "../application/use-cases/security-overview";
import { setFirstPassword } from "../application/use-cases/set-first-password";
import { FRESH_SIGN_IN_SECONDS } from "../infrastructure/auth/login-guard-hooks";
import { USER_PERMISSIONS as P } from "./permissions";
import { firstPasswordBody, staffMatchBody } from "./request-schemas";
import type { UsersDeps } from "./users-deps";

export function securityRouter(deps: (c: Context<ActorEnv>) => UsersDeps) {
  return new Hono<ActorEnv>()
    .get("/overview", requirePermission(P.viewMethods), async (c) => c.json(await securityOverview(deps(c))))
    .post("/staff-match", requirePermission(P.matchStaff), zValidator("json", staffMatchBody), async (c) => {
      const d = deps(c);
      return c.json(await matchStaffRecord({ accounts: d.accounts, staffRecords: d.staffRecords }, d.change, c.req.valid("json")));
    })
    .get("/me/settings", async (c) => {
      actorOf(c);
      const policy = await deps(c).settings.policy();
      return c.json({ webIdleMinutes: policy.webIdleMinutes, passwordMinLength: policy.passwordMinLength });
    })
    .post("/me/password", zValidator("json", firstPasswordBody), async (c) => {
      const d = deps(c);
      const me = actorOf(c);
      const writer = (await (await d.auth()).$context).internalAdapter;
      const session = (await d.accounts.sessionsOf(me.userId)).find((s) => s.id === me.sessionId);
      if (!session) throw new AppError("sign_in_required", "Please sign in again.");
      await setFirstPassword({ accounts: d.accounts, writer, alerts: d.alerts, policy: await d.settings.policy() }, d.change, { userId: me.userId, sessionCreatedAt: session.createdAt }, c.req.valid("json").newPassword, FRESH_SIGN_IN_SECONDS);
      return c.body(null, 204);
    })
    .get("/me/export", async (c) => {
      const d = deps(c);
      const data = await exportMyData(d.accounts, actorOf(c).userId, d.change.now);
      if (!data) throw new AppError("not_found", "Account not found.");
      // Downloaded as a file, never cached.
      c.header("content-disposition", 'attachment; filename="my-igongo-data.json"');
      c.header("cache-control", "no-store");
      return c.json(data);
    });
}
