/**
 * The lifetime earnings statement (S29-02): every payslip, bonus and advance
 * of one staff member since they joined, with totals for each year and for
 * all time.
 */

import type { AdvanceSummary } from "@igongo/contracts/advances-loans";
import type { BonusSummary } from "@igongo/contracts/bonuses-rewards";
import type { StaffRef } from "@igongo/contracts/hr-records";
import type { PayslipView } from "@igongo/contracts/payroll";

/** Totals for one year or for all time. Amounts are whole Uganda shillings. */
export interface EarningsTotals {
  gross: number;
  deductions: number;
  net: number;
  /** Cash bonuses paid or approved. */
  cashBonuses: number;
  /** Buffet passes given and used. */
  buffetPasses: number;
  buffetPassesUsed: number;
  advancesTaken: number;
  advancesRepaid: number;
  payslips: number;
}

export interface EarningsStatement {
  staff: StaffRef;
  lifetime: EarningsTotals;
  /** Newest year first. */
  years: { year: string; totals: EarningsTotals }[];
  payslips: PayslipView[];
  bonuses: BonusSummary[];
  advances: AdvanceSummary[];
}
