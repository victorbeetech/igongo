/**
 * The gateway: mounts each module's router under `/api`. Each router gets
 * its stores from `c.var.services`, built for this request only.
 *
 *   /api/auth/*            Better Auth (every sign-in method)        module 4
 *   /api/login-methods/*   login switches                            module 4
 *   /api/users/*           accounts and sessions                     module 4
 *   /api/setup/*           one-time first super admin                module 4
 *   /api/access/*          roles, permissions, my access             module 2
 *   /api/audit/*           audit search and tamper check             module 5
 *   /api/admin/*           module switches, settings, keys           module 1
 *   /api/public/*          settings safe to show before sign-in      module 1
 *   /api/notifications/*   push devices and sends                    module 10
 *   /api/hr, /cards, /wristbands, /attendance, /daily-reports,
 *   /staff-meals, /notices  the staff modules (see staff/staff-routes.ts)
 *   /api/crm, /menu, /orders, /delivery, /payments, /rooms, /museum,
 *   /events, /pool, /shop   the guest and rider modules (see guests/guest-routes.ts)
 *   /api/files, /faults, /inspections, /payroll, /advances, /bonuses,
 *   /earnings, /reports, /chat, /records  manager and money modules (see managers/manager-routes.ts)
 */

import { auditRouter } from "@igongo/audit-trail";
import type { ActorEnv } from "@igongo/core";
import { createNotificationsRouter } from "./notifications-mount";
import { rolesRouter } from "@igongo/roles-permissions";
import { consoleRouter, publicSettingsRouter } from "@igongo/super-admin";
import { AUTH_BASE_PATH, loginMethodsRouter, setupRouter, usersRouter, type UsersDeps } from "@igongo/users-login";
import type { Context, Hono } from "hono";
import type { ApiEnv } from "../shell/api-env";
import { moduleGate } from "./module-gate";
import { mountGuestRoutes } from "./guests/guest-routes";
import { mountManagerRoutes } from "./managers/manager-routes";
import { mountStaffRoutes } from "./staff/staff-routes";

/** The shell's context, seen through a module router's narrower type. */
const api = (c: Context<ActorEnv>) => c as unknown as Context<ApiEnv>;

/** Users & Login's dependencies for a request. */
function usersDeps(c: Context<ActorEnv>): UsersDeps {
  const s = api(c).var.services;
  return { accounts: s.accounts(), settings: s.loginSettings(), access: s.access(), change: s.changeContext(c.var.actor), auth: s.auth, bootstrapEmail: s.bootstrapEmail };
}

export function mountRoutes(app: Hono<ApiEnv>) {
  // Better Auth answers everything under /api/auth itself.
  app.on(["GET", "POST"], `${AUTH_BASE_PATH}/*`, async (c) => (await c.var.services.auth()).handler(c.req.raw));
  app.route("/api/login-methods", loginMethodsRouter(usersDeps));
  app.route("/api/users", usersRouter(usersDeps));
  app.route("/api/setup", setupRouter(usersDeps));
  app.route(
    "/api/access",
    rolesRouter((c) => {
      const s = api(c).var.services;
      return { roles: s.roles(), assignments: s.assignments(), change: s.changeContext(c.var.actor) };
    }),
  );
  app.route("/api/audit", auditRouter((c) => api(c).var.services.auditStore()));
  app.route(
    "/api/admin",
    consoleRouter((c) => {
      const s = api(c).var.services;
      return { store: s.console(), sealer: s.sealer, change: s.changeContext(c.var.actor) };
    }),
  );
  app.route("/api/public", publicSettingsRouter((c) => api(c).var.services.console()));
  // Non-core modules sit behind their switch.
  app.use("/api/notifications/*", moduleGate("notifications"));
  app.route("/api/notifications", createNotificationsRouter());
  mountStaffRoutes(app);
  mountGuestRoutes(app);
  mountManagerRoutes(app);
}
