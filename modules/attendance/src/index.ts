/**
 * Attendance (module 25) of the Igongo API. The gateway imports only this
 * file. See modules/attendance/README.md.
 */

export type { AttendanceDeps } from "./application/attendance-deps";
export { recordClock } from "./application/use-cases/record-clock";
export { DEFAULT_RULES, isLate, type AttendanceRules } from "./domain/attendance-rules";
export type { ClockEvent } from "./domain/clock-event";
export { summarizeDay, type DaySummary } from "./domain/day-summary";
export { DrizzleClockEventRepository } from "./infrastructure/db/drizzle-clock-event-repository";
export { SettingsRulesStore } from "./infrastructure/db/settings-rules-store";
export { ATTENDANCE_PERMISSIONS } from "./presentation/permissions";
export { attendanceRouter } from "./presentation/attendance-router";
export { attendanceKpis } from "./infrastructure/attendance-kpis";
