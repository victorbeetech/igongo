/**
 * Mounts the manager and money modules (build step 4). Each sits behind its
 * own module switch, so the super admin can turn one off (or put it in
 * maintenance) without touching the others.
 *
 *   /api/files/*         photos and documents                 module 11
 *   /api/faults/*        fault reports and maintenance        module 40
 *   /api/inspections/*   HOD daily checkups                   module 39
 *   /api/payroll/*       pay profiles, pay runs, payslips     module 28
 *   /api/advances/*      salary advances and loans            module 30
 *   /api/bonuses/*       cash and buffet bonuses              module 31
 *   /api/earnings/*      payslips and lifetime statements     module 29
 *   /api/reports/*       the management dashboard             module 81
 *   /api/chat/*          staff and guest chat                 module 50
 *   /api/records/*       records archive and search           module 6
 */

import { advancesRouter } from "@igongo/advances-loans";
import { bonusesRouter } from "@igongo/bonuses-rewards";
import { chatRouter } from "@igongo/chat";
import type { ActorEnv } from "@igongo/core";
import { earningsRouter } from "@igongo/earnings-statements";
import { faultsRouter } from "@igongo/faults-maintenance";
import { filesRouter } from "@igongo/files-media";
import { inspectionsRouter } from "@igongo/inspections";
import { payrollRouter } from "@igongo/payroll";
import { recordsRouter } from "@igongo/records-search";
import { reportsRouter } from "@igongo/reports-analytics";
import type { Context, Hono, MiddlewareHandler } from "hono";
import type { ApiEnv } from "../../shell/api-env";
import { mountModule as mount } from "../mount-module";
import type { PreparedDeps } from "./manager-services";

/** The manager services for this request. */
const managers = (c: Context<ActorEnv>) => (c as unknown as Context<ApiEnv>).var.services.managerModules(c.var.actor);

/**
 * Some modules' deps need an `await` (they ask which other modules are on).
 * This middleware builds them once, after the module switch let the request
 * in, so the module router can read them without waiting.
 */
const load =
  (key: keyof PreparedDeps): MiddlewareHandler<ApiEnv> =>
  async (c, next) => {
    await c.var.services.managerModules(c.var.actor).load(key);
    await next();
  };

/** The deps [load] built for [key]. */
const ready =
  <K extends keyof PreparedDeps>(key: K) =>
  (c: Context<ActorEnv>) =>
    managers(c).ready(key);

export function mountManagerRoutes(app: Hono<ApiEnv>) {
  mount(app, "files", "files-media", filesRouter((c) => managers(c).files()));
  mount(app, "faults", "faults-maintenance", faultsRouter((c) => managers(c).faults()));
  mount(app, "inspections", "inspections", inspectionsRouter(ready("inspections")), load("inspections"));
  mount(app, "payroll", "payroll", payrollRouter(ready("payroll")), load("payroll"));
  mount(app, "advances", "advances-loans", advancesRouter((c) => managers(c).advances()));
  mount(app, "bonuses", "bonuses-rewards", bonusesRouter((c) => managers(c).bonuses()));
  mount(app, "earnings", "earnings-statements", earningsRouter(ready("earnings")), load("earnings"));
  mount(app, "reports", "reports-analytics", reportsRouter(ready("reports")), load("reports"));
  mount(app, "chat", "chat", chatRouter((c) => managers(c).chat()));
  mount(app, "records", "records-search", recordsRouter((c) => managers(c).records()));
}
