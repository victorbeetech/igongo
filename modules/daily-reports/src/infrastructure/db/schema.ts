/**
 * Daily Reports' own Postgres schema, `reports`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, jsonb, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { REPORT_STATUSES, type ReportSection } from "../../domain/daily-report";

export const reportsSchema = pgSchema("reports");

export const reportStatus = reportsSchema.enum("report_status", REPORT_STATUSES);

/** One report per person per day, kept for ever. */
export const dailyReports = reportsSchema.table(
  "daily_reports",
  {
    id: text("id").primaryKey(),
    staffId: text("staff_id").notNull(),
    department: text("department"),
    workDate: text("work_date").notNull(),
    status: reportStatus("status").notNull(),
    sections: jsonb("sections").$type<ReportSection[]>().notNull(),
    photoUrls: jsonb("photo_urls").$type<string[]>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("daily_reports_staff_day_key").on(t.staffId, t.workDate), index("daily_reports_day_idx").on(t.workDate, t.department)],
);

/** Comments on reports. */
export const reportComments = reportsSchema.table(
  "report_comments",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => dailyReports.id),
    authorId: text("author_id").notNull(),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("report_comments_report_idx").on(t.reportId, t.at)],
);

/** The report template (key `template`). */
export const settings = moduleSettingsTable(reportsSchema);
