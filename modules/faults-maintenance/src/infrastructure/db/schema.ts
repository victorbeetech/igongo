/**
 * Faults & Maintenance's own Postgres schema, `faults`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const faultsSchema = pgSchema("faults");

/** Fault reports, kept for ever. */
export const faults = faultsSchema.table(
  "faults",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category"),
    location: text("location"),
    department: text("department"),
    priority: text("priority").notNull(),
    status: text("status").notNull(),
    photoIds: text("photo_ids").array().notNull(),
    reporterUserId: text("reporter_user_id"),
    reporterStaffId: text("reporter_staff_id"),
    reporterName: text("reporter_name").notNull(),
    assignedUserId: text("assigned_user_id"),
    assignedStaffId: text("assigned_staff_id"),
    assignedName: text("assigned_name"),
    sourceModule: text("source_module").notNull(),
    sourceRecordId: text("source_record_id"),
    fixNote: text("fix_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    fixedAt: timestamp("fixed_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
  },
  (t) => [index("faults_status_idx").on(t.status, t.createdAt), index("faults_department_idx").on(t.department, t.createdAt)],
);

/** Each fault's history: every status change, who and when. */
export const faultEvents = faultsSchema.table(
  "fault_events",
  {
    id: text("id").primaryKey(),
    faultId: text("fault_id")
      .notNull()
      .references(() => faults.id),
    byId: text("by_id"),
    byName: text("by_name").notNull(),
    from: text("from_status"),
    to: text("to_status").notNull(),
    note: text("note"),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("fault_events_fault_idx").on(t.faultId, t.at)],
);

/** One like per person per fault. */
export const faultLikes = faultsSchema.table(
  "fault_likes",
  {
    faultId: text("fault_id")
      .notNull()
      .references(() => faults.id),
    userId: text("user_id").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.faultId, t.userId] })],
);

/** Comments under faults. */
export const faultComments = faultsSchema.table(
  "fault_comments",
  {
    id: text("id").primaryKey(),
    faultId: text("fault_id")
      .notNull()
      .references(() => faults.id),
    authorId: text("author_id").notNull(),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("fault_comments_fault_idx").on(t.faultId, t.at)],
);

/** Categories and switches (key `settings`). */
export const settings = moduleSettingsTable(faultsSchema);
