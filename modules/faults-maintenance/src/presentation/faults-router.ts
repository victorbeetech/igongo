/**
 * Faults & Maintenance HTTP routes, mounted by the gateway at `/api/faults`.
 *
 *   GET   /faults                 faults in my scope (filters)          S40-02
 *   POST  /faults                 report a fault with photos            S40-01
 *   GET   /faults/summary         counts by status in my scope          S40-05
 *   GET   /faults/settings        categories and switches               S40-06
 *   PUT   /faults/settings        change them                           S40-06
 *   GET   /faults/:id             one fault, history, comments, likes   S40-03
 *   POST  /faults/:id/assign      give it to a technician               S40-04
 *   POST  /faults/:id/status      move it along its life                S40-03
 *   POST  /faults/:id/like        like or unlike
 *   POST  /faults/:id/comments    comment
 *
 * Who sees what comes from the scope on `faults-maintenance.faults.view`:
 * `all` sees every fault, `department` their department's, `own` only the
 * ones they reported or were given. Reporters and assignees always see theirs.
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, can, canForOthers, recordChange, requirePermission, requireStaffPermission, staffScope, type ActorEnv, type StaffScope } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { FaultFilter } from "../application/ports/fault-repository";
import type { FaultsDeps } from "../application/faults-deps";
import { assignFault, moveFault } from "../application/use-cases/move-fault";
import { commentOnFault, toggleFaultLike } from "../application/use-cases/react-to-fault";
import { reportFault } from "../application/use-cases/report-fault";
import type { Fault } from "../domain/fault";
import { FAULT_PERMISSIONS as P } from "./permissions";
import { assignBody, commentBody, listQuery, reportBody, settingsBody, statusBody } from "./request-schemas";

/** True when [scope] (for the person [userId]) reaches [fault]. */
function reaches(scope: StaffScope | null, fault: Fault, userId: string): boolean {
  if (fault.reportedBy.userId === userId || fault.assignedTo?.userId === userId) return true;
  if (!scope) return false;
  if (scope.kind === "all") return true;
  return scope.kind === "department" && fault.department === scope.department;
}

export function faultsRouter(deps: (c: Context<ActorEnv>) => FaultsDeps) {
  /** The caller's staff record, or null for accounts without one. */
  const self = (c: Context<ActorEnv>): Promise<StaffRef | null> => deps(c).staff.byUserId(actorOf(c).userId);

  /** The fault in the address, if the caller may see it. @throws AppError `not_found` */
  async function visible(c: Context<ActorEnv>): Promise<Fault> {
    const fault = await deps(c).faults.get(c.req.param("id") as string);
    const actor = actorOf(c);
    if (!fault || !reaches(staffScope(actor, P.view, await self(c)), fault, actor.userId)) throw new AppError("not_found", "Fault not found.");
    return fault;
  }

  return (
    new Hono<ActorEnv>()
      .get("/", requirePermission(P.view), zValidator("query", listQuery), async (c) => {
        const d = deps(c);
        const q = c.req.valid("query");
        const actor = actorOf(c);
        const me = await self(c);
        const scope = staffScope(actor, P.view, me);
        const filter: FaultFilter = { limit: q.limit, offset: q.offset, ...(q.status ? { status: q.status } : {}), ...(q.open === "1" ? { openOnly: true } : {}) };
        // "Assigned to me" is a plain filter; otherwise the scope narrows the list.
        if (q.mine === "assigned") filter.assignedStaffId = me?.staffId ?? "-";
        else if (q.mine === "reported" || !scope || scope.kind === "own") filter.onlyPerson = actor.userId;
        else if (scope.kind === "department") Object.assign(filter, { department: scope.department, alsoPerson: actor.userId });
        return c.json({
          items: await d.faults.list(filter, actor.userId),
          settings: await d.settings.read(),
          can: { report: can(actor, P.create), assign: canForOthers(actor, P.edit), like: can(actor, P.like), comment: can(actor, P.comment) },
        });
      })
      .post("/", requirePermission(P.create), zValidator("json", reportBody), async (c) => {
        const actor = actorOf(c);
        const me = await self(c);
        const body = c.req.valid("json");
        const fault = await reportFault(deps(c), {
          ...body,
          department: me?.department ?? null,
          reporter: { userId: actor.userId, name: actor.name, staffId: me?.staffId ?? null },
          source: { module: "staff", recordId: "" },
        });
        return c.json(fault, 201);
      })
      .get("/summary", requirePermission(P.view), async (c) => {
        const scope = staffScope(actorOf(c), P.view, await self(c));
        if (!scope || scope.kind === "own") return c.json({ counts: {} });
        return c.json({ counts: await deps(c).faults.countByStatus(scope.kind === "department" ? scope.department : undefined) });
      })
      .get("/settings", requirePermission(P.view), async (c) => c.json(await deps(c).settings.read()))
      .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
        const d = deps(c);
        const value = c.req.valid("json");
        await d.settings.write(value, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "faults-maintenance", action: "settings.changed", recordType: "settings", recordId: "settings", summary: `Fault settings: ${value.categories.length} categories, likes ${value.likesEnabled ? "on" : "off"}, comments ${value.commentsEnabled ? "on" : "off"}` });
        return c.json(value);
      })
      .get("/:id", requirePermission(P.view), async (c) => {
        const d = deps(c);
        const fault = await visible(c);
        return c.json({ fault, events: await d.faults.events(fault.id), comments: await d.faults.comments(fault.id), likes: await d.faults.likeCount(fault.id), settings: await d.settings.read() });
      })
      .post("/:id/assign", requireStaffPermission(P.edit), zValidator("json", assignBody), async (c) => {
        const actor = actorOf(c);
        const body = c.req.valid("json");
        return c.json(await assignFault(deps(c), await visible(c), body.staffId, { userId: actor.userId, name: actor.name }, body.note));
      })
      .post("/:id/status", requirePermission(P.view), zValidator("json", statusBody), async (c) => {
        const actor = actorOf(c);
        const fault = await visible(c);
        const { status, note } = c.req.valid("json");
        // Editors move anything; the assignee works it; the reporter or an approver closes or reopens it.
        const editor = canForOthers(actor, P.edit);
        const assignee = fault.assignedTo?.userId === actor.userId && ["in_progress", "on_hold", "fixed"].includes(status);
        const closer = (fault.reportedBy.userId === actor.userId || canForOthers(actor, P.approve)) && (status === "closed" || (fault.status === "fixed" && status === "in_progress"));
        if (!editor && !assignee && !closer) throw new AppError("permission_denied", "You cannot move this fault.");
        return c.json(await moveFault(deps(c), fault, status, { userId: actor.userId, name: actor.name }, note));
      })
      .post("/:id/like", requirePermission(P.like), async (c) => c.json(await toggleFaultLike(deps(c), await visible(c), actorOf(c).userId)))
      .post("/:id/comments", requirePermission(P.comment), zValidator("json", commentBody), async (c) => {
        const actor = actorOf(c);
        return c.json(await commentOnFault(deps(c), await visible(c), { userId: actor.userId, name: actor.name }, c.req.valid("json").body), 201);
      })
  );
}
