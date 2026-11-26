/**
 * Permission keys Earnings Statements checks. Every staff member holds
 * `view` with scope `own` (their own payslips and statement); HR and
 * finance hold it with `all`.
 */

export const EARNINGS_PERMISSIONS = {
  view: "earnings-statements.statements.view",
  export: "earnings-statements.statements.export",
} as const;
