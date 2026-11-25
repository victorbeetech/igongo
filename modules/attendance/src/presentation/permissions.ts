/**
 * Permission keys Attendance checks. The super admin gives them to roles.
 * The scope of `view` and `edit` decides whose records a person reaches
 * (own, team/department or all).
 */

export const ATTENDANCE_PERMISSIONS = {
  /** Clock yourself in and out from the app. */
  clockSelf: "attendance.clock.create",
  /** Run a gate or reception station that clocks other people's cards (scope all or location). */
  station: "attendance.station.create",
  /** See attendance records and boards. */
  view: "attendance.records.view",
  /** Add corrections. */
  edit: "attendance.records.edit",
  /** Change the attendance rules. */
  rules: "attendance.rules.edit",
} as const;
