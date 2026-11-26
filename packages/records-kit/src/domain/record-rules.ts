/**
 * The pure rules of the records kit, with no database: which type and
 * status a key means, cleaning a form's values against the type's fields,
 * and whether a move to a status is allowed. Tested in test/record-rules.test.ts.
 */

import { AppError } from "@igongo/core";
import type { FieldDef, FieldValue } from "./field-def";
import type { RecordConfig } from "./record-config";
import type { RecordType } from "./record-type";
import type { StatusDef } from "./status-def";

/**
 * The type [key] in [config].
 * @throws AppError `bad_request` when there is no such type
 */
export function typeOf(config: RecordConfig, key: string): RecordType {
  const type = config.types.find((t) => t.key === key);
  if (!type) throw new AppError("bad_request", `There is no record type "${key}".`);
  return type;
}

/** Where every new record of [type] starts. */
export function startStatus(type: RecordType): StatusDef {
  const first = type.statuses[0];
  if (!first) throw new AppError("not_configured", `${type.name} has no statuses yet. Add them in the settings.`);
  return first;
}

/** The status [key] of [type], or a plain one when the super admin has since removed it. */
export function statusOf(type: RecordType, key: string): StatusDef {
  return type.statuses.find((s) => s.key === key) ?? { key, label: key };
}

/** One value turned into the field's kind, or null when empty. */
function coerce(field: FieldDef, raw: FieldValue | undefined): FieldValue {
  if (raw === undefined || raw === null || raw === "") return null;
  switch (field.kind) {
    case "number":
    case "money": {
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new AppError("bad_request", `${field.label} must be a number.`);
      // Money is whole shillings.
      return field.kind === "money" ? Math.round(n) : n;
    }
    case "yesno":
      return raw === true || raw === "true" || raw === "yes";
    case "date":
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(raw))) throw new AppError("bad_request", `${field.label} must be a date.`);
      return String(raw);
    case "select":
      if (field.options?.length && !field.options.includes(String(raw))) throw new AppError("bad_request", `${field.label} must be one of: ${field.options.join(", ")}.`);
      return String(raw);
    default:
      // Text, phone, time, staff and photo IDs are kept as short text.
      return String(raw).trim().slice(0, field.kind === "longtext" ? 5000 : 500);
  }
}

/**
 * [input] cleaned against [type]'s fields: unknown keys dropped, each value
 * turned into its kind, and required fields checked.
 * @param partial true for an edit, where missing fields keep their old values
 */
export function cleanFields(type: RecordType, input: Record<string, FieldValue>, partial = false): Record<string, FieldValue> {
  const out: Record<string, FieldValue> = {};
  for (const field of type.fields) {
    if (partial && !(field.key in input)) continue;
    const value = coerce(field, input[field.key]);
    if (field.required && value === null) throw new AppError("bad_request", `${field.label} is needed.`);
    out[field.key] = value;
  }
  return out;
}

/** A title for a record: the one typed, else the first filled text field, else the type's name. */
export function titleFor(type: RecordType, fields: Record<string, FieldValue>, typed?: string): string {
  if (typed?.trim()) return typed.trim().slice(0, 200);
  const first = type.fields.find((f) => (f.kind === "text" || f.kind === "select") && fields[f.key]);
  return first ? String(fields[first.key]).slice(0, 200) : type.name;
}

/**
 * Checks a move of a [type] record to status [to].
 * @throws AppError when the status is unknown or needs an approver
 */
export function checkMove(type: RecordType, to: string, canApprove: boolean): StatusDef {
  const status = type.statuses.find((s) => s.key === to);
  if (!status) throw new AppError("bad_request", `${type.name} has no status "${to}".`);
  if (status.approval && !canApprove) throw new AppError("permission_denied", `Only an approver can move this to ${status.label}.`);
  return status;
}
