/**
 * Permission keys Advances & Loans checks. Every staff member holds
 * `view`/`create` with scope `own` (their own requests); finance and HR hold
 * them with `all`.
 */

export const ADVANCE_PERMISSIONS = {
  view: "advances-loans.requests.view",
  /** Ask for an advance or loan. */
  create: "advances-loans.requests.create",
  /** Approve or decline. */
  approve: "advances-loans.requests.approve",
  /** Pay out, and take cash repayments. */
  edit: "advances-loans.requests.edit",
  settings: "advances-loans.settings.edit",
} as const;
