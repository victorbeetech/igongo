/** A pay run's totals from its payslips. */

import { sumOf } from "../../domain/compute-payslip";
import type { PayRun } from "../../domain/pay-run";
import type { Payslip } from "../../domain/payslip";

export function totalsOf(payslips: Payslip[]): Pick<PayRun, "staffCount" | "gross" | "deductions" | "net" | "employerCost"> {
  return {
    staffCount: payslips.length,
    gross: payslips.reduce((n, p) => n + p.gross, 0),
    deductions: payslips.reduce((n, p) => n + p.totalDeductions, 0),
    net: payslips.reduce((n, p) => n + p.net, 0),
    employerCost: payslips.reduce((n, p) => n + sumOf(p.employer), 0),
  };
}
