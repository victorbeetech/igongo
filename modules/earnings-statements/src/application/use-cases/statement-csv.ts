/** The statement as spreadsheet rows: one row per payslip, then the lifetime totals. */

import { toCsv } from "@igongo/core";
import type { EarningsStatement } from "../../domain/earnings-statement";

export function statementCsv(s: EarningsStatement): string {
  const t = s.lifetime;
  return toCsv([
    [`Earnings statement: ${s.staff.name} (${s.staff.staffNumber})`],
    ["Month", "Gross", "Deductions", "Net", "Status"],
    ...s.payslips.map((p) => [p.period, p.gross, p.totalDeductions, p.net, p.status]),
    [],
    ["Lifetime", t.gross, t.deductions, t.net],
    ["Cash bonuses", t.cashBonuses],
    ["Buffet passes (given / used)", `${t.buffetPasses} / ${t.buffetPassesUsed}`],
    ["Advances (taken / repaid)", `${t.advancesTaken} / ${t.advancesRepaid}`],
  ]);
}
