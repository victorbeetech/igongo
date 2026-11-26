/**
 * Reports & Analytics HTTP routes, mounted by the gateway at `/api/reports`.
 *
 *   GET  /reports/dashboard?from&to       tiles from every module I may see   S81-01
 *   GET  /reports/dashboard/export.csv    the same as a spreadsheet           S81-05
 *   GET  /reports/settings                hidden tiles and default range      S81-06
 *   PUT  /reports/settings                change them                         S81-06
 *   GET  /reports/catalogue               every tile there is (for settings)  S81-06
 */

import { zValidator } from "@hono/zod-validator";
import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { actorOf, canForOthers, recordChange, requireStaffPermission, scopeOf, toCsv, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { ReportsDeps } from "../application/reports-deps";
import { readDashboard } from "../application/use-cases/read-dashboard";
import { hotelRange } from "./hotel-range";
import { REPORT_PERMISSIONS as P } from "./permissions";
import { rangeQuery, settingsBody } from "./request-schemas";

export function reportsRouter(deps: (c: Context<ActorEnv>) => ReportsDeps) {
  /** The sources the caller may see: all with scope `all`, otherwise their modules only. */
  function sourcesFor(c: Context<ActorEnv>): KpiSource[] {
    const actor = actorOf(c);
    const sources = deps(c).sources;
    if (scopeOf(actor, P.view) === "all") return sources;
    return sources.filter((s) => canForOthers(actor, `${s.module}.reports.view`));
  }

  /** The dashboard for the query's range. */
  async function dashboard(c: Context<ActorEnv>, q: { from?: string; to?: string }) {
    const d = deps(c);
    const settings = await d.settings.read();
    const range = hotelRange(d.change.now, settings.defaultDays, q.from, q.to);
    return { from: range.fromDay, to: range.toDay, groups: await readDashboard(sourcesFor(c), range, settings.hidden) };
  }

  return new Hono<ActorEnv>()
    .get("/dashboard", requireStaffPermission(P.view), zValidator("query", rangeQuery), async (c) => c.json(await dashboard(c, c.req.valid("query"))))
    .get("/dashboard/export.csv", requireStaffPermission(P.export), zValidator("query", rangeQuery), async (c) => {
      const d = await dashboard(c, c.req.valid("query"));
      const rows = [["From", d.from, "To", d.to], ["Area", "Number", "Value", "Unit"], ...d.groups.flatMap((g) => g.kpis.map((k) => [g.title, k.label, k.value, k.unit]))];
      await recordChange(deps(c).change, { module: "reports-analytics", action: "dashboard.exported", recordType: "dashboard", recordId: `${d.from}..${d.to}`, summary: `Downloaded the dashboard for ${d.from} to ${d.to}` });
      return c.body(toCsv(rows), 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="dashboard-${d.from}-${d.to}.csv"` });
    })
    .get("/settings", requireStaffPermission(P.view), async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const value = c.req.valid("json");
      await d.settings.write(value, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "reports-analytics", action: "settings.changed", recordType: "settings", recordId: "dashboard", summary: `Dashboard: ${value.hidden.length} tiles hidden, opens on ${value.defaultDays} days` });
      return c.json(value);
    })
    .get("/catalogue", requireStaffPermission(P.settings), async (c) => {
      // Every tile, read over today so the settings page can list them.
      const range = hotelRange(deps(c).change.now, 1);
      return c.json({ groups: await readDashboard(deps(c).sources, range, []) });
    });
}
