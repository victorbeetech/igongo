/**
 * Saved and scheduled reports (S81-02, S81-03), part of `/api/reports`.
 *
 *   GET    /saved                 my saved reports (everyone's at scope `all`)
 *   POST   /saved                 save one
 *   PUT    /saved/:id             change it
 *   DELETE /saved/:id             remove it (its runs stay)
 *   POST   /saved/:id/run         run it now
 *   GET    /saved/:id/runs        its past runs, newest first
 *   GET    /runs/:id              one run with its numbers
 *   GET    /runs/:id/export.csv   one run as a spreadsheet
 *
 * A viewer limited to some areas can only save those areas, so a scheduled
 * run (which reads as the system) never shows them more than they may see.
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, recordChange, requireStaffPermission, toCsv, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { ReportsDeps } from "../application/reports-deps";
import { runSavedReport } from "../application/use-cases/run-saved-report";
import { createReport, removeReport, updateReport } from "../application/use-cases/save-report";
import type { SavedReport, SavedReportInput } from "../domain/saved-report";
import { REPORT_PERMISSIONS as P } from "./permissions";
import { runsQuery, savedBody } from "./request-schemas";
import { seesAll, viewerSources } from "./viewer-sources";

export function savedRouter(deps: (c: Context<ActorEnv>) => ReportsDeps) {
  /** The report in the path, if the caller owns it or sees everything; null otherwise. */
  async function reportFor(c: Context<ActorEnv>): Promise<SavedReport | null> {
    const report = await deps(c).saved.get(c.req.param("id") as string);
    if (!report) return null;
    return report.ownerId === actorOf(c).userId || seesAll(c) ? report : null;
  }

  /** [input] with its areas limited to what the caller may see (all of theirs when empty). */
  function allowedInput(c: Context<ActorEnv>, input: SavedReportInput): SavedReportInput | null {
    if (seesAll(c)) return input;
    const mine = viewerSources(c, deps(c).sources).map((s) => s.module);
    if (!input.modules.length) return { ...input, modules: mine };
    return input.modules.every((m) => mine.includes(m)) ? input : null;
  }

  const notFound = (c: Context<ActorEnv>) => c.json({ error: "not_found", message: "No such report." }, 404);
  const notAllowed = (c: Context<ActorEnv>) => c.json({ error: "forbidden", message: "You can only report on the areas you can see." }, 403);

  return new Hono<ActorEnv>()
    .get("/saved", requireStaffPermission(P.view), async (c) => c.json({ reports: await deps(c).saved.list(seesAll(c) ? null : actorOf(c).userId) }))
    .post("/saved", requireStaffPermission(P.view), zValidator("json", savedBody), async (c) => {
      const input = allowedInput(c, c.req.valid("json"));
      if (!input) return notAllowed(c);
      return c.json(await createReport(deps(c).saved, deps(c).change, input), 201);
    })
    .put("/saved/:id", requireStaffPermission(P.view), zValidator("json", savedBody), async (c) => {
      const report = await reportFor(c);
      if (!report) return notFound(c);
      const input = allowedInput(c, c.req.valid("json"));
      if (!input) return notAllowed(c);
      return c.json(await updateReport(deps(c).saved, deps(c).change, report, input));
    })
    .delete("/saved/:id", requireStaffPermission(P.view), async (c) => {
      const report = await reportFor(c);
      if (!report) return notFound(c);
      await removeReport(deps(c).saved, deps(c).change, report);
      return c.body(null, 204);
    })
    .post("/saved/:id/run", requireStaffPermission(P.view), async (c) => {
      const report = await reportFor(c);
      if (!report) return notFound(c);
      const d = deps(c);
      const { hidden } = await d.settings.read();
      // By hand, the caller's own view of the numbers.
      return c.json(await runSavedReport(d.saved, viewerSources(c, d.sources), hidden, report, "manual", d.change), 201);
    })
    .get("/saved/:id/runs", requireStaffPermission(P.view), zValidator("query", runsQuery), async (c) => {
      const report = await reportFor(c);
      if (!report) return notFound(c);
      return c.json({ report, runs: await deps(c).saved.runsOf(report.id, c.req.valid("query").limit) });
    })
    .get("/runs/:id", requireStaffPermission(P.view), async (c) => {
      const run = await deps(c).saved.getRun(c.req.param("id"));
      const report = run ? await deps(c).saved.get(run.reportId) : null;
      // A run of a removed report is readable only by those who see everything.
      if (!run || (report ? report.ownerId !== actorOf(c).userId && !seesAll(c) : !seesAll(c))) return notFound(c);
      return c.json(run);
    })
    .get("/runs/:id/export.csv", requireStaffPermission(P.export), async (c) => {
      const d = deps(c);
      const run = await d.saved.getRun(c.req.param("id"));
      const report = run ? await d.saved.get(run.reportId) : null;
      if (!run || (report ? report.ownerId !== actorOf(c).userId && !seesAll(c) : !seesAll(c))) return notFound(c);
      const rows = [["Report", run.reportName], ["From", run.fromDay, "To", run.toDay], ["Area", "Number", "Value", "Unit"], ...run.groups.flatMap((g) => g.kpis.map((k) => [g.title, k.label, k.value, k.unit]))];
      await recordChange(d.change, { module: "reports-analytics", action: "report.exported", recordType: "report-run", recordId: run.id, summary: `Downloaded "${run.reportName}" for ${run.fromDay} to ${run.toDay}` });
      return c.body(toCsv(rows), 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="report-${run.fromDay}-${run.toDay}.csv"` });
    });
}
