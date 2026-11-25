/**
 * Attendance's own Postgres schema, `attendance`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { boolean, index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { CLOCK_KINDS, CLOCK_METHODS } from "../../domain/clock-event";

export const attendanceSchema = pgSchema("attendance");

export const clockKind = attendanceSchema.enum("clock_kind", CLOCK_KINDS);
export const clockMethod = attendanceSchema.enum("clock_method", CLOCK_METHODS);

/** Every clock-in and clock-out, append-only, kept for ever. */
export const clockEvents = attendanceSchema.table(
  "clock_events",
  {
    id: text("id").primaryKey(),
    staffId: text("staff_id").notNull(),
    department: text("department"),
    kind: clockKind("kind").notNull(),
    method: clockMethod("method").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
    /** Hotel calendar day, YYYY-MM-DD. */
    workDate: text("work_date").notNull(),
    station: text("station").notNull(),
    late: boolean("late").notNull().default(false),
    recordedBy: text("recorded_by"),
    note: text("note"),
  },
  (t) => [index("clock_events_staff_at_idx").on(t.staffId, t.at), index("clock_events_date_idx").on(t.workDate, t.department)],
);

/** The super admin's attendance rules (key `rules`). */
export const settings = moduleSettingsTable(attendanceSchema);
