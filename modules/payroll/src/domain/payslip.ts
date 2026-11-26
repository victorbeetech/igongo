/** One person's pay in one pay run (S28-03). */

import type { AdvanceDue } from "@igongo/contracts/advances-loans";
import type { PayLine } from "@igongo/contracts/payroll";

export interface Payslip {
  id: string;
  runId: string;
  period: string;
  staffId: string;
  staffName: string;
  staffNumber: string;
  department: string | null;
  basic: number;
  /** Allowances, cash bonuses and additions. */
  earnings: PayLine[];
  gross: number;
  /** The super admin's deductions, advance instalments and other deductions. */
  deductions: PayLine[];
  totalDeductions: number;
  net: number;
  /** The hotel's own shares, not taken from pay. */
  employer: PayLine[];
  /** Manual lines a payroll officer added: positive adds to pay, negative takes from it. */
  adjustments: PayLine[];
  /** The cash bonuses and advance instalments in this payslip, to settle when the run is paid. */
  bonusIds: string[];
  advanceLines: AdvanceDue[];
}
