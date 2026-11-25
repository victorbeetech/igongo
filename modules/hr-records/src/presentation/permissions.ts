/** Permission keys HR Records checks. The super admin gives them to roles. */

export const HR_PERMISSIONS = {
  /** See staff profiles (scope: all, department or own). */
  view: "hr-records.staff.view",
  /** Enrol new staff. */
  create: "hr-records.staff.create",
  /** Change profiles, link accounts, mark people as left. */
  edit: "hr-records.staff.edit",
} as const;
