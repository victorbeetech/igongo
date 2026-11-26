/**
 * Changing a record: edit its fields, move it to another status, assign
 * it, or comment. Each change adds a history line and an audit entry.
 *
 * Who may do what:
 *   staff (wide)      edit, assign and move any record they can see
 *   the assignee      move the records given to them (such as a task to Done)
 *   the owner         edit while it is still in its first status, and comment
 *   approvers         also move into statuses marked "approval"
 */

import { AppError, newId, recordChange } from "@igongo/core";
import type { FieldValue } from "../../domain/field-def";
import type { RecordEventKind } from "../../domain/record-event";
import { checkMove, cleanFields, startStatus, statusOf, typeOf } from "../../domain/record-rules";
import type { WorkRecord } from "../../domain/work-record";
import type { Caller } from "../caller";
import type { RecordsDeps } from "../records-deps";
import { assigneeName } from "./assignee-name";

/** True when [caller] is part of [record] (owner, creator or assignee). */
export function involves(record: WorkRecord, caller: Caller): boolean {
  return record.ownerId === caller.userId || record.createdBy === caller.userId || (!!caller.staffId && record.assigneeId === caller.staffId);
}

/**
 * The record [id], if [caller] may see it.
 * @throws AppError `not_found` otherwise (so nobody learns it exists)
 */
export async function visibleRecord(deps: RecordsDeps, caller: Caller, id: string): Promise<WorkRecord> {
  const record = await deps.records.byId(id);
  if (!record || (!caller.wide && !involves(record, caller))) throw new AppError("not_found", "Record not found.");
  return record;
}

/** Saves [record] with one history line and one audit entry. */
async function commit(deps: RecordsDeps, caller: Caller, record: WorkRecord, kind: RecordEventKind, text: string): Promise<WorkRecord> {
  const now = deps.change.now;
  const saved = { ...record, updatedAt: now };
  await deps.records.save(saved);
  await deps.records.addEvent({ id: newId("rev"), recordId: record.id, kind, text, status: saved.status, byId: caller.userId, byName: caller.name, at: now });
  await recordChange(deps.change, { module: deps.module.key, action: `record.${kind}`, recordType: record.type, recordId: record.id, summary: `${record.code}: ${text}` });
  return saved;
}

/** The changes an edit may carry. */
export interface RecordEdit {
  title?: string;
  fields?: Record<string, FieldValue>;
  dueOn?: string | null;
  location?: string | null;
}

export async function editRecord(deps: RecordsDeps, caller: Caller, record: WorkRecord, edit: RecordEdit): Promise<WorkRecord> {
  const type = typeOf(await deps.config.read(), record.type);
  // Owners may fix their own record only before anyone acts on it.
  if (!caller.wide && record.status !== startStatus(type).key) throw new AppError("conflict", "This can no longer be changed. Add a comment instead.");
  const fields = edit.fields ? { ...record.fields, ...cleanFields(type, edit.fields, true) } : record.fields;
  const changed = Object.keys(edit).join(", ");
  return commit(deps, caller, {
    ...record,
    fields,
    ...(edit.title?.trim() ? { title: edit.title.trim().slice(0, 200) } : {}),
    ...(edit.dueOn !== undefined ? { dueOn: edit.dueOn } : {}),
    ...(edit.location !== undefined ? { location: edit.location?.trim() || null } : {}),
  }, "edited", `Changed ${changed}`);
}

export async function moveRecord(deps: RecordsDeps, caller: Caller, record: WorkRecord, to: string, note?: string): Promise<WorkRecord> {
  const assignee = !!caller.staffId && record.assigneeId === caller.staffId;
  if (!caller.wide && !assignee) throw new AppError("permission_denied", "Only staff can change the status.");
  const type = typeOf(await deps.config.read(), record.type);
  const next = checkMove(type, to, caller.canApprove);
  const from = statusOf(type, record.status).label;
  const text = `${from} to ${next.label}${note?.trim() ? `: ${note.trim()}` : ""}`;
  return commit(deps, caller, { ...record, status: next.key, closedAt: next.done ? deps.change.now : null }, "status", text);
}

export async function assignRecord(deps: RecordsDeps, caller: Caller, record: WorkRecord, staffId: string | null): Promise<WorkRecord> {
  if (!caller.wide) throw new AppError("permission_denied", "Only staff can assign work.");
  const name = await assigneeName(deps, staffId);
  return commit(deps, caller, { ...record, assigneeId: staffId, assigneeName: name }, "assigned", name ? `Assigned to ${name}` : "Unassigned");
}

export async function commentOn(deps: RecordsDeps, caller: Caller, record: WorkRecord, text: string): Promise<WorkRecord> {
  if (!(await deps.config.read()).comments) throw new AppError("method_disabled", "Comments are switched off here.");
  return commit(deps, caller, record, "comment", text.trim().slice(0, 2000));
}
