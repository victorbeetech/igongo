/**
 * Inspections' own Postgres schema, `inspections`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { boolean, date, index, integer, jsonb, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { CheckResult } from "../../domain/check-result";
import type { ChecklistItem } from "../../domain/checklist-item";

export const inspectionsSchema = pgSchema("inspections");

/** The checklists the super admin and HODs build. */
export const checklists = inspectionsSchema.table("checklists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  frequency: text("frequency").notNull(),
  dueBy: text("due_by").notNull(),
  items: jsonb("items").$type<ChecklistItem[]>().notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/** Done checklists, kept for ever. */
export const runs = inspectionsSchema.table(
  "runs",
  {
    id: text("id").primaryKey(),
    checklistId: text("checklist_id")
      .notNull()
      .references(() => checklists.id),
    checklistName: text("checklist_name").notNull(),
    department: text("department").notNull(),
    workDate: date("work_date", { mode: "string" }).notNull(),
    inspectorUserId: text("inspector_user_id").notNull(),
    inspectorStaffId: text("inspector_staff_id"),
    inspectorName: text("inspector_name").notNull(),
    results: jsonb("results").$type<CheckResult[]>().notNull(),
    score: integer("score").notNull(),
    faults: integer("faults").notNull(),
    note: text("note"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("runs_checklist_idx").on(t.checklistId, t.workDate), index("runs_department_idx").on(t.department, t.workDate)],
);

/** One like per person per run. */
export const runLikes = inspectionsSchema.table(
  "run_likes",
  {
    runId: text("run_id")
      .notNull()
      .references(() => runs.id),
    userId: text("user_id").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.runId, t.userId] })],
);

/** Comments under runs. */
export const runComments = inspectionsSchema.table(
  "run_comments",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id),
    authorId: text("author_id").notNull(),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("run_comments_run_idx").on(t.runId, t.at)],
);

/** The switches (key `settings`). */
export const settings = moduleSettingsTable(inspectionsSchema);
