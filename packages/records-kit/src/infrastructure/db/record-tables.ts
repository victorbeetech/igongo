/**
 * The tables every records-kit module has, each in its own Postgres schema
 * (`lost_found`, `tasks`, `leave`...): records, record_events (history) and
 * settings (the super admin's set-up). One shape, so the kit's repository
 * works for all of them, while no module ever reads another's tables.
 *
 * @example export const tables = recordTables(pgSchema("lost_found"));
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, jsonb, text, timestamp, uniqueIndex, type PgSchema } from "drizzle-orm/pg-core";
import type { FieldValue } from "../../domain/field-def";
import { RECORD_EVENT_KINDS } from "../../domain/record-event";

export function recordTables(schema: PgSchema) {
  /** Every record, kept for ever. */
  const records = schema.table(
    "records",
    {
      id: text("id").primaryKey(),
      code: text("code").notNull(),
      type: text("type").notNull(),
      title: text("title").notNull(),
      status: text("status").notNull(),
      fields: jsonb("fields").$type<Record<string, FieldValue>>().notNull(),
      ownerId: text("owner_id"),
      ownerName: text("owner_name").notNull(),
      assigneeId: text("assignee_id"),
      assigneeName: text("assignee_name"),
      dueOn: text("due_on"),
      location: text("location"),
      createdBy: text("created_by"),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
      closedAt: timestamp("closed_at", { withTimezone: true }),
    },
    // Codes are unique; lists read by type and status, by person, and by day.
    (t) => [
      uniqueIndex("records_code_key").on(t.code),
      index("records_type_idx").on(t.type, t.status, t.updatedAt),
      index("records_owner_idx").on(t.ownerId, t.createdAt),
      index("records_assignee_idx").on(t.assigneeId, t.status),
      index("records_due_idx").on(t.dueOn),
    ],
  );

  /** Each record's history, append-only. */
  const events = schema.table(
    "record_events",
    {
      id: text("id").primaryKey(),
      recordId: text("record_id").notNull(),
      kind: text("kind", { enum: RECORD_EVENT_KINDS }).notNull(),
      text: text("text").notNull(),
      status: text("status"),
      byId: text("by_id"),
      byName: text("by_name").notNull(),
      at: timestamp("at", { withTimezone: true }).notNull(),
    },
    (t) => [index("record_events_record_idx").on(t.recordId, t.at)],
  );

  return { records, events, settings: moduleSettingsTable(schema) };
}

/** The tables of one records module. */
export type RecordTables = ReturnType<typeof recordTables>;
