/** The super admin's payroll settings (S28-06). */

import type { DeductionRule } from "./deduction-rule";

export interface PayrollSettings {
  deductions: DeductionRule[];
  /** The person who approves a pay run must not be the one who made it. */
  approverMustDiffer: boolean;
}

export const DEFAULT_PAYROLL_SETTINGS: PayrollSettings = { deductions: [], approverMustDiffer: true };
