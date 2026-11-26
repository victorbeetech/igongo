/**
 * The HTTP routes every records module has, mounted by the gateway at
 * `/api/<path>` (such as `/api/lost-found`). Built once here, used by every
 * operations, HR, guest-service and money module on the kit.
 *
 *   GET   /config                  the record types, fields and statuses (signed in)
 *   PUT   /config                  save them (super admin or the module's manager)
 *   GET   /records?type&status&open&mine&assigned&q&from&to
 *                                  a list: everyone's for staff, my own otherwise
 *   POST  /records                 add one
 *   GET   /records/:id             one record with its history
 *   PATCH /records/:id             edit its fields
 *   POST  /records/:id/status      move it to another status (editors, approvers, the assignee)
 *   POST  /records/:id/assign      give it to a staff member (staff)
 *   POST  /records/:id/comments    comment
 *   GET   /lookup/:code            find by code or QR text `IGG-REC:<code>` (staff)
 *   GET   /summary                 counts by type and status, for boards
 *   GET   /export?type             a spreadsheet (CSV)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, can, requirePermission, requireSignIn, toCsv, type ActorEnv } from "@igongo/core";
import type { MiddlewareHandler } from "hono";
import { Hono, type Context } from "hono";
import type { Caller } from "../application/caller";
import type { RecordsDeps } from "../application/records-deps";
import { createRecord } from "../application/use-cases/create-record";
import { assignRecord, commentOn, editRecord, moveRecord, visibleRecord } from "../application/use-cases/change-record";
import { saveConfig } from "../application/use-cases/save-config";
import { recordPermissions } from "./record-permissions";
import { wideReach } from "./wide-reach";
import { assignBody, commentBody, configBody, createBody, editBody, listQuery, moveBody } from "./request-schemas";

/** The text inside a record's QR code. */
export const RECORD_QR_PREFIX = "IGG-REC:";

export function recordsRouter(moduleKey: string, deps: (c: Context<ActorEnv>) => RecordsDeps) {
  const P = recordPermissions(moduleKey);

  /** The caller, with how far their permission [key] reaches. */
  async function caller(c: Context<ActorEnv>, key: string): Promise<Caller> {
    const actor = actorOf(c);
    const staff = deps(c).staff;
    const self = staff ? await staff.byUserId(actor.userId) : null;
    return { userId: actor.userId, name: actor.name, staffId: self?.staffId ?? null, wide: wideReach(actor, key), canApprove: wideReach(actor, P.approve) };
  }

  /** Middleware: the caller must hold [key] for everyone's records (staff tools, settings). */
  const requireWide =
    (key: string): MiddlewareHandler<ActorEnv> =>
    async (c, next) => {
      if (!wideReach(actorOf(c), key)) throw new AppError("permission_denied", `You need the permission ${key}.`);
      await next();
    };

  return new Hono<ActorEnv>()
    .get("/config", requireSignIn, async (c) => c.json(await deps(c).config.read()))
    .put("/config", requireWide(P.settings), zValidator("json", configBody), async (c) => c.json(await saveConfig(deps(c), c.req.valid("json"))))
    .get("/records", requirePermission(P.view), zValidator("query", listQuery), async (c) => {
      const q = c.req.valid("query");
      const who = await caller(c, P.view);
      // Holders of only `own` always get their own records; staff may ask for theirs.
      const involving = !who.wide || q.mine ? { userId: who.userId, staffId: who.staffId } : undefined;
      const items = await deps(c).records.list({
        ...(q.type ? { type: q.type } : {}),
        ...(q.status ? { status: q.status } : {}),
        ...(q.open ? { open: q.open === "1" } : {}),
        ...(involving ? { involving } : {}),
        ...(q.assigned && who.staffId ? { assigneeId: who.staffId } : {}),
        ...(q.q ? { words: q.q } : {}),
        ...(q.from ? { dueFrom: q.from } : {}),
        ...(q.to ? { dueTo: q.to } : {}),
        limit: 500,
      });
      return c.json({ items });
    })
    .post("/records", requirePermission(P.create), zValidator("json", createBody), async (c) => {
      const b = c.req.valid("json");
      const record = await createRecord(deps(c), await caller(c, P.create), {
        type: b.type, fields: b.fields, ...(b.title ? { title: b.title } : {}), ...(b.assigneeId !== undefined ? { assigneeId: b.assigneeId } : {}),
        ...(b.dueOn !== undefined ? { dueOn: b.dueOn } : {}), ...(b.location !== undefined ? { location: b.location } : {}), ...(b.ownerName ? { ownerName: b.ownerName } : {}),
      });
      return c.json({ ...record, qr: `${RECORD_QR_PREFIX}${record.code}` }, 201);
    })
    .get("/records/:id", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const record = await visibleRecord(d, await caller(c, P.view), c.req.param("id"));
      return c.json({ record: { ...record, qr: `${RECORD_QR_PREFIX}${record.code}` }, events: await d.records.events(record.id) });
    })
    .patch("/records/:id", requireSignIn, zValidator("json", editBody), async (c) => {
      const d = deps(c);
      const who = await caller(c, P.edit);
      const record = await visibleRecord(d, who, c.req.param("id"));
      const b = c.req.valid("json");
      return c.json(await editRecord(d, who, record, {
        ...(b.title ? { title: b.title } : {}), ...(b.fields ? { fields: b.fields } : {}), ...(b.dueOn !== undefined ? { dueOn: b.dueOn } : {}), ...(b.location !== undefined ? { location: b.location } : {}),
      }));
    })
    .post("/records/:id/status", requireSignIn, zValidator("json", moveBody), async (c) => {
      const d = deps(c);
      // Editors, approvers (such as a supervisor approving or rejecting leave) and the assignee may move it.
      const editor = await caller(c, P.edit);
      const who = { ...editor, wide: editor.wide || editor.canApprove };
      const { status, note } = c.req.valid("json");
      return c.json(await moveRecord(d, who, await visibleRecord(d, who, c.req.param("id")), status, note));
    })
    .post("/records/:id/assign", requireWide(P.edit), zValidator("json", assignBody), async (c) => {
      const d = deps(c);
      const who = await caller(c, P.edit);
      return c.json(await assignRecord(d, who, await visibleRecord(d, who, c.req.param("id")), c.req.valid("json").staffId));
    })
    .post("/records/:id/comments", requireSignIn, zValidator("json", commentBody), async (c) => {
      const d = deps(c);
      const who = await caller(c, P.view);
      const record = await visibleRecord(d, who, c.req.param("id"));
      // Staff need the comment permission; owners may always reply on their own record.
      if (who.wide && !can(actorOf(c), P.comment)) throw new AppError("permission_denied", `You need the permission ${P.comment}.`);
      return c.json(await commentOn(d, who, record, c.req.valid("json").text), 201);
    })
    .get("/lookup/:code", requireWide(P.view), async (c) => {
      const record = await deps(c).records.byCode(c.req.param("code").replace(RECORD_QR_PREFIX, ""));
      if (!record) throw new AppError("not_found", "No record has that code.");
      return c.json({ ...record, qr: `${RECORD_QR_PREFIX}${record.code}` });
    })
    .get("/summary", requireWide(P.view), async (c) => c.json({ items: await deps(c).records.counts() }))
    .get("/export", requireWide(P.export), zValidator("query", listQuery.pick({ type: true, from: true, to: true })), async (c) => {
      const d = deps(c);
      const q = c.req.valid("query");
      const config = await d.config.read();
      const items = await d.records.list({ ...(q.type ? { type: q.type } : {}), ...(q.from ? { dueFrom: q.from } : {}), ...(q.to ? { dueTo: q.to } : {}), limit: 50_000 });
      // One column per field of every type exported, after the fixed ones.
      const fields = config.types.filter((t) => !q.type || t.key === q.type).flatMap((t) => t.fields);
      const keys = [...new Map(fields.map((f) => [f.key, f])).values()];
      const rows = [
        ["Code", "Type", "Title", "Status", "For", "Assigned to", "Due", "Where", "Added", "Closed", ...keys.map((f) => f.label)],
        ...items.map((r) => [r.code, r.type, r.title, r.status, r.ownerName, r.assigneeName, r.dueOn, r.location, r.createdAt, r.closedAt, ...keys.map((f) => r.fields[f.key])]),
      ];
      return c.body(toCsv(rows), 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${moduleKey}.csv"` });
    });
}
