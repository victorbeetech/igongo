/**
 * Permission keys Payroll checks. Every route is a staff tool and needs a
 * scope wider than `own`: staff see their own payslips through Earnings
 * Statements, never here.
 */

export const PAYROLL_PERMISSIONS = {
  view: "payroll.runs.view",
  /** Start and recalculate pay runs. */
  create: "payroll.runs.create",
  /** Adjust payslips, mark paid, cancel. */
  edit: "payroll.runs.edit",
  approve: "payroll.runs.approve",
  export: "payroll.runs.export",
  profilesView: "payroll.profiles.view",
  profilesEdit: "payroll.profiles.edit",
  settings: "payroll.settings.edit",
} as const;
