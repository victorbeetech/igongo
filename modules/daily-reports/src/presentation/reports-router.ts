/**
 * Daily Reports HTTP routes, mounted by the gateway at `/api/daily-reports`.
 *
 *   GET   /daily-reports/template          the sections to fill (S38-02)
 *   PUT   /daily-reports/template          change them (S38-07)
 *   GET   /daily-reports/mine?date         my report for a day, or null (S38-01)
 *   PUT   /daily-reports/mine/:date        save or send it (S38-02)
 *   GET   /daily-reports?from&to&status    reports in my scope (S38-03, S38-04, S38-05)
 *   GET   /daily-reports/missing?date      who has not reported (S38-08)
 *   GET   /daily-reports/:id               one report with comments (S38-06)
 *   POST  /daily-reports/:id/review        sign or return it (S38-06)
 *   POST  /daily-reports/:id/comments      comment on it (S38-06)
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, hotelDate, newId, recordChange, requirePermission, scopeReaches, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { ReportsDeps } from "../application/reports-deps";
import { missingReports } from "../application/use-cases/missing-reports";
import { reviewReport } from "../application/use-cases/review-report";
import { saveMyReport } from "../application/use-cases/save-my-report";
import type { DailyReport } from "../domain/daily-report";
import { REPORT_PERMISSIONS as P } from "./permissions";
import { commentBody, dayQuery, listQuery, reviewBody, saveBody, templateBody } from "./request-schemas";

export function reportsRouter(deps: (c: Context<ActorEnv>) => ReportsDeps) {
  /** The caller's own staff record, or null. */
  const selfOrNull = (c: Context<ActorEnv>) => deps(c).staff.byUserId(actorOf(c).userId);

  /** The caller's own staff record. @throws AppError `not_found` */
  async function self(c: Context<ActorEnv>): Promise<StaffRef> {
    const me = await selfOrNull(c);
    if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
    return me;
  }

  /** Whose reports the caller reaches with [permission]. @throws AppError `permission_denied` */
  async function scopeFor(c: Context<ActorEnv>, permission: string) {
    const scope = staffScope(actorOf(c), permission, await selfOrNull(c));
    if (!scope) throw new AppError("permission_denied", `You need the permission ${permission}.`);
    return scope;
  }

  /** The report in the address, if [permission]'s scope reaches it. @throws AppError `not_found` */
  async function reachable(c: Context<ActorEnv>, permission: string): Promise<DailyReport> {
    const report = await deps(c).reports.get(c.req.param("id") as string);
    if (!report || !scopeReaches(await scopeFor(c, permission), report)) throw new AppError("not_found", "Report not found.");
    return report;
  }

  return (
    new Hono<ActorEnv>()
      .get("/template", async (c) => c.json(await deps(c).template.read()))
      .put("/template", requirePermission(P.template), zValidator("json", templateBody), async (c) => {
        const d = deps(c);
        const template = c.req.valid("json");
        await d.template.write(template, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "daily-reports", action: "template.changed", recordType: "settings", recordId: "template", summary: `Changed the daily report template (${template.sections.length} sections, due ${template.dueBy})` });
        return c.json(template);
      })
      .get("/mine", zValidator("query", dayQuery), async (c) => {
        const d = deps(c);
        const me = await self(c);
        const date = c.req.valid("query").date ?? hotelDate(d.change.now);
        const report = await d.reports.forDay(me.staffId, date);
        return c.json({ date, report, comments: report ? await d.reports.comments(report.id) : [], template: await d.template.read() });
      })
      .put("/mine/:date", requirePermission(P.write), zValidator("json", saveBody), async (c) => {
        const workDate = c.req.param("date");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) throw new AppError("bad_request", "Use a date like 2026-11-25.");
        return c.json(await saveMyReport(deps(c), await self(c), { workDate, ...c.req.valid("json") }));
      })
      .get("/", zValidator("query", listQuery), async (c) => {
        const scope = await scopeFor(c, P.view);
        const q = c.req.valid("query");
        const items = await deps(c).reports.list({ ...q, ...(scope.kind === "department" ? { department: scope.department } : {}), ...(scope.kind === "own" ? { staffId: scope.staffId } : {}) });
        // Drafts are private to the writer.
        const visible = items.filter((r) => r.status !== "draft");
        const people = new Map((await deps(c).staff.byIds([...new Set(visible.map((r) => r.staffId))])).map((s) => [s.staffId, s]));
        return c.json({ items: visible.map((r) => ({ ...r, staff: people.get(r.staffId) ?? null })) });
      })
      .get("/missing", zValidator("query", dayQuery), async (c) => {
        const d = deps(c);
        const date = c.req.valid("query").date ?? hotelDate(d.change.now);
        return c.json({ date, items: await missingReports(d, await scopeFor(c, P.view), date) });
      })
      .get("/:id", async (c) => {
        const report = await reachable(c, P.view);
        if (report.status === "draft") throw new AppError("not_found", "Report not found.");
        return c.json({ report, staff: await deps(c).staff.byId(report.staffId), comments: await deps(c).reports.comments(report.id) });
      })
      .post("/:id/review", zValidator("json", reviewBody), async (c) => {
        const report = await reachable(c, P.approve);
        // Nobody signs their own report.
        if (report.staffId === (await selfOrNull(c))?.staffId) throw new AppError("permission_denied", "Your own report is signed by your supervisor.");
        return c.json(await reviewReport(deps(c), report, c.req.valid("json")));
      })
      .post("/:id/comments", zValidator("json", commentBody), async (c) => {
        const d = deps(c);
        const actor = actorOf(c);
        const report = await d.reports.get(c.req.param("id"));
        // The writer may always reply; others need the comment permission's scope.
        const mine = report && report.staffId === (await selfOrNull(c))?.staffId;
        if (!report || (!mine && !scopeReaches(await scopeFor(c, P.comment), report))) throw new AppError("not_found", "Report not found.");
        const comment = { id: newId("drc"), reportId: report.id, authorId: actor.userId, authorName: actor.name, body: c.req.valid("json").body, at: d.change.now };
        await d.reports.addComment(comment);
        return c.json(comment, 201);
      })
  );
}
