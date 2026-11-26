/**
 * Creating a record: check the type may be raised by this caller, clean the
 * form against the type's fields, number it, find the assignee's name, save
 * it with a "created" history line, and record it in the Audit Trail.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import type { FieldValue } from "../../domain/field-def";
import { cleanFields, startStatus, titleFor, typeOf } from "../../domain/record-rules";
import type { WorkRecord } from "../../domain/work-record";
import type { Caller } from "../caller";
import type { RecordsDeps } from "../records-deps";
import { assigneeName } from "./assignee-name";

/** What a form sends to create a record. */
export interface NewRecord {
  type: string;
  title?: string;
  fields: Record<string, FieldValue>;
  assigneeId?: string | null;
  dueOn?: string | null;
  location?: string | null;
  /** Staff raising a record for someone else (such as a guest at the desk) give their name. */
  ownerName?: string;
}

export async function createRecord(deps: RecordsDeps, caller: Caller, input: NewRecord): Promise<WorkRecord> {
  const config = await deps.config.read();
  const type = typeOf(config, input.type);
  // Step 1: may this caller raise this type?
  if (!type.active) throw new AppError("bad_request", `${type.name} is switched off.`);
  if (!caller.wide && !type.selfService) throw new AppError("permission_denied", `Only staff can add a ${type.name.toLowerCase()}.`);
  // Step 2: clean the form; only staff assign work.
  const fields = cleanFields(type, input.fields);
  const assigneeId = caller.wide ? (input.assigneeId ?? null) : null;
  const forOther = caller.wide && !!input.ownerName?.trim();
  const now = deps.change.now;
  const record: WorkRecord = {
    id: newId("rec"),
    code: await deps.records.nextCode(deps.module.prefix),
    type: type.key,
    title: titleFor(type, fields, input.title),
    status: startStatus(type).key,
    fields,
    ownerId: forOther ? null : caller.userId,
    ownerName: forOther ? (input.ownerName as string).trim() : caller.name,
    assigneeId,
    assigneeName: await assigneeName(deps, assigneeId),
    dueOn: input.dueOn ?? null,
    location: input.location?.trim() || null,
    createdBy: caller.userId,
    createdAt: now,
    updatedAt: now,
    closedAt: null,
  };
  // Step 3: save with its first history line, then the audit.
  await deps.records.save(record);
  await deps.records.addEvent({ id: newId("rev"), recordId: record.id, kind: "created", text: `${type.name} added`, status: record.status, byId: caller.userId, byName: caller.name, at: now });
  await recordChange(deps.change, { module: deps.module.key, action: "record.created", recordType: type.key, recordId: record.id, summary: `${record.code} ${record.title}` });
  return record;
}
