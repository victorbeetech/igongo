/**
 * Inspections HTTP routes, mounted by the gateway at `/api/inspections`.
 *
 *   GET   /inspections/checklists          checklists in my scope            S39-01
 *   POST  /inspections/checklists          build one                         S39-01
 *   PUT   /inspections/checklists/:id      change or switch it off           S39-01
 *   GET   /inspections/today               what I should do today, and done  S39-03
 *   POST  /inspections/runs                submit a done checklist           S39-02
 *   GET   /inspections/runs                runs in my scope                  S39-04
 *   GET   /inspections/runs/:id            one run with comments             S39-04
 *   POST  /inspections/runs/:id/like       like or unlike
 *   POST  /inspections/runs/:id/comments   comment
 *   GET   /inspections/settings            likes and comments switches
 *   PUT   /inspections/settings            change them
 *
 * Scopes: `all` reaches every department, `department` the caller's own;
 * `own`/`assigned` lets the caller do their department's checklists and see
 * the runs they did.
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, can, hotelDate, newId, recordChange, requirePermission, requireStaffPermission, staffScope, type ActorEnv, type StaffScope } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { InspectionsDeps } from "../application/inspections-deps";
import { periodStart } from "../application/use-cases/period-start";
import { commentOnRun, toggleRunLike } from "../application/use-cases/react-to-run";
import { submitRun } from "../application/use-cases/submit-run";
import type { Checklist, ChecklistDraft } from "../domain/checklist";
import type { InspectionRun } from "../domain/inspection-run";
import { INSPECTION_PERMISSIONS as P } from "./permissions";
import { checklistBody, commentBody, runBody, runsQuery, settingsBody } from "./request-schemas";

/** True when [scope] reaches work in [department]. */
function reachesDepartment(scope: StaffScope | null, department: string, self: StaffRef | null): boolean {
  if (!scope) return false;
  if (scope.kind === "all") return true;
  if (scope.kind === "department") return scope.department === department;
  return self?.department === department;
}

export function inspectionsRouter(deps: (c: Context<ActorEnv>) => InspectionsDeps) {
  /** The caller, their staff record and their scope for [permission]. */
  async function who(c: Context<ActorEnv>, permission: string) {
    const actor = actorOf(c);
    const self = await deps(c).staff.byUserId(actor.userId);
    return { actor, self, scope: staffScope(actor, permission, self) };
  }

  /** The checklists the caller reaches with [permission]. */
  async function checklistsFor(c: Context<ActorEnv>, permission: string, activeOnly: boolean): Promise<Checklist[]> {
    const { self, scope } = await who(c, permission);
    const all = await deps(c).inspections.checklists({ activeOnly });
    return all.filter((l) => reachesDepartment(scope, l.department, self));
  }

  /** The run in the address, if the caller may see it. @throws AppError `not_found` */
  async function visibleRun(c: Context<ActorEnv>): Promise<InspectionRun> {
    const run = await deps(c).inspections.run(c.req.param("id") as string);
    const { actor, self, scope } = await who(c, P.view);
    const ok = run && (run.inspectorUserId === actor.userId || (scope && scope.kind !== "own" && reachesDepartment(scope, run.department, self)));
    if (!run || !ok) throw new AppError("not_found", "Checkup not found.");
    return run;
  }

  /** Saves a checklist from the request body, new or changed. */
  async function saveChecklist(c: Context<ActorEnv>, body: ChecklistDraft, existing: Checklist | null) {
    const d = deps(c);
    const now = d.change.now;
    const checklist: Checklist = { ...body, id: existing?.id ?? newId("chk"), createdAt: existing?.createdAt ?? now, updatedAt: now };
    await d.inspections.saveChecklist(checklist);
    await recordChange(d.change, { module: "inspections", action: existing ? "checklist.changed" : "checklist.created", recordType: "checklist", recordId: checklist.id, summary: `${existing ? "Changed" : "Built"} the checklist "${checklist.name}" (${checklist.items.length} lines)` });
    return checklist;
  }

  return (
    new Hono<ActorEnv>()
      .get("/checklists", requirePermission(P.view), async (c) => {
        // Builders see every checklist; others the ones in their scope.
        const items = can(actorOf(c), P.build) ? await deps(c).inspections.checklists({}) : await checklistsFor(c, P.view, true);
        return c.json({ items });
      })
      .post("/checklists", requireStaffPermission(P.build), zValidator("json", checklistBody), async (c) => c.json(await saveChecklist(c, c.req.valid("json"), null), 201))
      .put("/checklists/:id", requireStaffPermission(P.build), zValidator("json", checklistBody), async (c) => {
        const existing = await deps(c).inspections.checklist(c.req.param("id"));
        if (!existing) throw new AppError("not_found", "Checklist not found.");
        return c.json(await saveChecklist(c, c.req.valid("json"), existing));
      })
      .get("/today", requirePermission(P.create), async (c) => {
        const d = deps(c);
        const today = hotelDate(d.change.now);
        const lists = await checklistsFor(c, P.create, true);
        // For each checklist, the run that counts for this day or week, if any.
        const items = await Promise.all(lists.map(async (l) => ({ checklist: l, done: await d.inspections.latestRun(l.id, periodStart(today, l.frequency)) })));
        return c.json({ date: today, items });
      })
      .post("/runs", requirePermission(P.create), zValidator("json", runBody), async (c) => {
        const d = deps(c);
        const body = c.req.valid("json");
        const { actor, self, scope } = await who(c, P.create);
        const checklist = await d.inspections.checklist(body.checklistId);
        if (!checklist || !reachesDepartment(scope, checklist.department, self)) throw new AppError("not_found", "Checklist not found.");
        return c.json(await submitRun(d, checklist, { userId: actor.userId, name: actor.name, staff: self }, body.answers, body.note), 201);
      })
      .get("/runs", requirePermission(P.view), zValidator("query", runsQuery), async (c) => {
        const q = c.req.valid("query");
        const { actor, scope } = await who(c, P.view);
        const narrow = !scope || scope.kind === "own" ? { inspectorUserId: actor.userId } : scope.kind === "department" ? { department: scope.department } : {};
        const items = await deps(c).inspections.runs({ ...q, ...narrow }, actor.userId);
        return c.json({ items, settings: await deps(c).settings.read(), can: { like: can(actor, P.like), comment: can(actor, P.comment) } });
      })
      .get("/runs/:id", async (c) => {
        const d = deps(c);
        const run = await visibleRun(c);
        return c.json({ run, comments: await d.inspections.comments(run.id), likes: await d.inspections.likeCount(run.id), settings: await d.settings.read() });
      })
      .post("/runs/:id/like", requirePermission(P.like), async (c) => c.json(await toggleRunLike(deps(c), await visibleRun(c), actorOf(c).userId)))
      .post("/runs/:id/comments", requirePermission(P.comment), zValidator("json", commentBody), async (c) => {
        const actor = actorOf(c);
        return c.json(await commentOnRun(deps(c), await visibleRun(c), { userId: actor.userId, name: actor.name }, c.req.valid("json").body), 201);
      })
      .get("/settings", requirePermission(P.view), async (c) => c.json(await deps(c).settings.read()))
      .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
        const d = deps(c);
        const value = c.req.valid("json");
        await d.settings.write(value, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "inspections", action: "settings.changed", recordType: "settings", recordId: "settings", summary: `Checkups: likes ${value.likesEnabled ? "on" : "off"}, comments ${value.commentsEnabled ? "on" : "off"}` });
        return c.json(value);
      })
  );
}
