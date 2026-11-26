/**
 * Reports & Analytics' own Postgres schema, `analytics`: its settings, saved
 * reports and their runs. The live numbers come from each module's KPI
 * source. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, integer, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import type { DashboardGroup } from "../../domain/dashboard-group";

export const analyticsSchema = pgSchema("analytics");

/** The dashboard settings (key `dashboard`). */
export const settings = moduleSettingsTable(analyticsSchema);

/** Saved reports (S81-02): a named pick of areas and days, maybe on a schedule. */
export const savedReports = analyticsSchema.table(
  "saved_reports",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id").notNull(),
    ownerName: text("owner_name").notNull(),
    modules: text("modules").array().notNull(),
    days: integer("days").notNull(),
    schedule: text("schedule").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  },
  (t) => [index("saved_reports_owner_idx").on(t.ownerId), index("saved_reports_schedule_idx").on(t.schedule)],
);

/** Every run of a saved report, with its numbers as they were; kept for ever. */
export const reportRuns = analyticsSchema.table(
  "report_runs",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id").notNull(),
    reportName: text("report_name").notNull(),
    fromDay: text("from_day").notNull(),
    toDay: text("to_day").notNull(),
    trigger: text("trigger").notNull(),
    groups: jsonb("groups").$type<DashboardGroup[]>().notNull(),
    ranAt: timestamp("ran_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("report_runs_report_idx").on(t.reportId, t.ranAt)],
);
