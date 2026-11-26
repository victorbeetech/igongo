/**
 * Public contract of Advances & Loans (module 30). Payroll takes the
 * instalments due each month through `AdvanceRecovery`; Earnings Statements
 * reads a person's history through `AdvanceHistory`.
 */

/** One instalment Payroll should take from one person's pay. */
export interface AdvanceDue {
  advanceId: string;
  /** The advance's number, such as `ADV-0007`, for the payslip line. */
  number: string;
  staffId: string;
  amount: number;
}

export interface AdvanceRecovery {
  /** Instalments due for the pay month [period] (`YYYY-MM`), not yet taken. */
  dueFor(period: string): Promise<AdvanceDue[]>;
  /** Marks instalments as taken by the pay run [payRunId]. Taking the same one twice does nothing. */
  recovered(lines: AdvanceDue[], period: string, payRunId: string): Promise<void>;
}

/** One advance or loan in a person's history. */
export interface AdvanceSummary {
  advanceId: string;
  number: string;
  kind: "advance" | "loan";
  amount: number;
  repaid: number;
  status: string;
  requestedAt: Date;
}

export interface AdvanceHistory {
  forStaff(staffId: string): Promise<AdvanceSummary[]>;
}
