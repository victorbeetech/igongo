/**
 * The Audit Trail's own Postgres schema, `audit`. No other module reads it.
 *
 * Rows are append-only: the migration adds triggers that refuse UPDATE,
 * DELETE and TRUNCATE, and a trigger that fills `seq`, `prev_hash` and
 * `hash` on insert, so the hash chain is built by the database itself and
 * cannot be skipped by any code path. The migration also adds a full-text
 * search column (`search`) with a GIN index; Drizzle does not need to know it.
 */

import { bigint, index, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import type { AuditContext, FieldChange } from "@igongo/contracts/audit-trail";

/** The `audit` schema. */
export const auditSchema = pgSchema("audit");

/** One recorded action. Never changed or deleted. */
export const auditEvents = auditSchema.table(
  "events",
  {
    /** Position in the chain, given by the insert trigger under a lock. */
    // `seq`, `prev_hash` and `hash` have placeholder defaults; the insert
    // trigger always replaces them, so code can never choose them.
    seq: bigint("seq", { mode: "number" }).primaryKey().default(0),
    /** Public ID, such as `aud_...`. */
    id: text("id").notNull().unique(),
    occurredAt: timestamp("occurred_at", { withTimezone: true, precision: 6 }).notNull().defaultNow(),
    actorId: text("actor_id"),
    actorName: text("actor_name"),
    actorRole: text("actor_role"),
    action: text("action").notNull(),
    module: text("module").notNull(),
    recordType: text("record_type"),
    recordId: text("record_id"),
    summary: text("summary").notNull(),
    changes: jsonb("changes").$type<Record<string, FieldChange>>(),
    context: jsonb("context").$type<AuditContext>(),
    /** The hash of the row before this one (64 zeros for the first row). */
    prevHash: text("prev_hash").notNull().default(""),
    /** SHA-256 of this row's content and `prev_hash`. */
    hash: text("hash").notNull().default(""),
  },
  (t) => [
    // The searches the console offers: by person, module, record and time.
    index("events_actor_idx").on(t.actorId, t.occurredAt),
    index("events_module_idx").on(t.module, t.occurredAt),
    index("events_record_idx").on(t.recordType, t.recordId),
    index("events_occurred_idx").on(t.occurredAt),
  ],
);
