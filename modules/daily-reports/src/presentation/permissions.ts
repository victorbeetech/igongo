/**
 * Permission keys Daily Reports checks. The scope of `view`, `approve` and
 * `comment` decides whose reports a person reaches (own, team/department, all).
 */

export const REPORT_PERMISSIONS = {
  /** Write your own daily report. */
  write: "daily-reports.reports.create",
  view: "daily-reports.reports.view",
  /** Sign or return reports. */
  approve: "daily-reports.reports.approve",
  comment: "daily-reports.reports.comment",
  /** Change the template. */
  template: "daily-reports.templates.edit",
} as const;
