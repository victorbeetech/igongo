/** Builds a lifetime earnings statement from the three histories, with no database. */

import type { AdvanceSummary } from "@igongo/contracts/advances-loans";
import type { BonusSummary } from "@igongo/contracts/bonuses-rewards";
import type { StaffRef } from "@igongo/contracts/hr-records";
import type { PayslipView } from "@igongo/contracts/payroll";
import type { EarningsStatement, EarningsTotals } from "./earnings-statement";

/** Bonus statuses that count as earned. */
const EARNED = ["approved", "paid", "used"];
/** Advance statuses where money was handed over. */
const TAKEN = ["disbursed", "repaid"];

const empty = (): EarningsTotals => ({ gross: 0, deductions: 0, net: 0, cashBonuses: 0, buffetPasses: 0, buffetPassesUsed: 0, advancesTaken: 0, advancesRepaid: 0, payslips: 0 });

export function buildStatement(staff: StaffRef, payslips: PayslipView[], bonuses: BonusSummary[], advances: AdvanceSummary[]): EarningsStatement {
  const lifetime = empty();
  const years = new Map<string, EarningsTotals>();
  /** Adds [f]'s change to the lifetime totals and to [year]'s. */
  const add = (year: string, f: (t: EarningsTotals) => void) => {
    f(lifetime);
    if (!years.has(year)) years.set(year, empty());
    f(years.get(year) as EarningsTotals);
  };
  for (const p of payslips)
    add(p.period.slice(0, 4), (t) => {
      t.gross += p.gross;
      t.deductions += p.totalDeductions;
      t.net += p.net;
      t.payslips += 1;
    });
  for (const b of bonuses.filter((b) => EARNED.includes(b.status)))
    add(String(b.createdAt.getUTCFullYear()), (t) => {
      t.cashBonuses += b.kind === "cash" ? b.amount : 0;
      t.buffetPasses += b.passes;
      t.buffetPassesUsed += b.passesUsed;
    });
  for (const a of advances.filter((a) => TAKEN.includes(a.status)))
    add(String(a.requestedAt.getUTCFullYear()), (t) => {
      t.advancesTaken += a.amount;
      t.advancesRepaid += a.repaid;
    });
  return {
    staff,
    lifetime,
    years: [...years.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([year, totals]) => ({ year, totals })),
    payslips,
    bonuses,
    advances,
  };
}
