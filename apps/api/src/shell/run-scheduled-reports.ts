/**
 * The daily 7 AM (Kampala) job: runs every saved report whose schedule says
 * today, as the system, on the modules that are switched on. Skipped when
 * Reports & Analytics itself is switched off.
 */

import { runDueReports, type DueRunReport } from "@igongo/reports-analytics";
import type { Database } from "@igongo/core";
import { RequestServices } from "../wiring/request-services";
import type { Env } from "./env";

export async function runScheduledReports(db: Database, env: Env, now: Date): Promise<DueRunReport | "off"> {
  // 1. One set of services for the whole job, with no signed-in person.
  const services = new RequestServices(db, env, `cron-${now.toISOString()}`, now);
  // 2. Nothing to do when the super admin switched reports off.
  const state = await services.modules().stateOf("reports-analytics");
  if (!state.enabled || state.maintenance) return "off";
  // 3. Run what is due.
  return runDueReports(await services.managerModules(undefined).reports());
}
