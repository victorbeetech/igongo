/**
 * Public contract of Payroll (module 28). Earnings Statements reads a
 * person's payslips through `PayHistory`, never Payroll's tables.
 */

/** One line on a payslip: an allowance, bonus, deduction or instalment. */
export interface PayLine {
  name: string;
  amount: number;
}

/** A payslip from an approved or paid pay run. Amounts are whole Uganda shillings. */
export interface PayslipView {
  payslipId: string;
  payRunId: string;
  /** The pay month, `YYYY-MM`. */
  period: string;
  staffId: string;
  staffName: string;
  staffNumber: string;
  department: string | null;
  basic: number;
  earnings: PayLine[];
  gross: number;
  deductions: PayLine[];
  totalDeductions: number;
  net: number;
  /** `approved` or `paid`. */
  status: string;
  paidAt: Date | null;
}

export interface PayHistory {
  /** Every approved or paid payslip of [staffId], newest month first. */
  forStaff(staffId: string): Promise<PayslipView[]>;
}
