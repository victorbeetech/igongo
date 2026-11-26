/** Payroll's `PayHistory` contract, for Earnings Statements. */

import type { PayHistory } from "@igongo/contracts/payroll";
import type { PayrollRepository } from "../application/ports/payroll-repository";

export function payHistory(payroll: PayrollRepository): PayHistory {
  return {
    forStaff: async (staffId) =>
      (await payroll.history(staffId)).map((p) => ({
        payslipId: p.id,
        payRunId: p.runId,
        period: p.period,
        staffId: p.staffId,
        staffName: p.staffName,
        staffNumber: p.staffNumber,
        department: p.department,
        basic: p.basic,
        earnings: p.earnings,
        gross: p.gross,
        deductions: p.deductions,
        totalDeductions: p.totalDeductions,
        net: p.net,
        status: p.status,
        paidAt: p.paidAt,
      })),
  };
}
