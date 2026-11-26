/**
 * The KPI sources a viewer may see: every one with the dashboard view at
 * scope `all`, otherwise only the modules whose own `<module>.reports.view`
 * they hold wider than `own`.
 */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { actorOf, canForOthers, scopeOf, type ActorEnv } from "@igongo/core";
import type { Context } from "hono";
import { REPORT_PERMISSIONS as P } from "./permissions";

/** True when the caller sees every module's numbers (and everyone's saved reports). */
export const seesAll = (c: Context<ActorEnv>): boolean => scopeOf(actorOf(c), P.view) === "all";

export function viewerSources(c: Context<ActorEnv>, sources: KpiSource[]): KpiSource[] {
  if (seesAll(c)) return sources;
  const actor = actorOf(c);
  return sources.filter((s) => canForOthers(actor, `${s.module}.reports.view`));
}
