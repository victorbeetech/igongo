/**
 * Works out one payslip (S28-03), with no database:
 *   gross      = basic + allowances + cash bonuses + positive adjustments
 *   deductions = each rule (on gross or basic) + advance instalments + negative adjustments
 *   net        = gross - deductions
 */

import type { AdvanceDue } from "@igongo/contracts/advances-loans";
import type { CashBonusDue } from "@igongo/contracts/bonuses-rewards";
import type { PayLine } from "@igongo/contracts/payroll";
import { deductionOf, type DeductionRule } from "./deduction-rule";
import type { PayProfile } from "./pay-profile";
import type { Payslip } from "./payslip";

/** Adds up [lines]. */
export const sumOf = (lines: PayLine[]) => lines.reduce((n, l) => n + l.amount, 0);

export interface PayslipInput {
  id: string;
  runId: string;
  period: string;
  staff: { staffId: string; name: string; staffNumber: string; department: string | null };
  profile: Pick<PayProfile, "basic" | "allowances">;
  bonuses: CashBonusDue[];
  advances: (AdvanceDue & { number: string })[];
  adjustments: PayLine[];
  rules: DeductionRule[];
}

export function computePayslip(i: PayslipInput): Payslip {
  // 1. Earnings and gross.
  const earnings: PayLine[] = [
    ...i.profile.allowances,
    ...i.bonuses.map((b) => ({ name: `Bonus: ${b.reason}`, amount: b.amount })),
    ...i.adjustments.filter((a) => a.amount > 0),
  ];
  const gross = i.profile.basic + sumOf(earnings);
  // 2. The super admin's rules, then advances and negative adjustments.
  const employer: PayLine[] = [];
  const deductions: PayLine[] = [];
  for (const rule of i.rules) {
    const d = deductionOf(rule, i.profile.basic, gross);
    if (d.employee) deductions.push({ name: rule.name, amount: d.employee });
    if (d.employer) employer.push({ name: rule.name, amount: d.employer });
  }
  deductions.push(...i.advances.map((a) => ({ name: `Advance ${a.number}`, amount: a.amount })));
  deductions.push(...i.adjustments.filter((a) => a.amount < 0).map((a) => ({ name: a.name, amount: -a.amount })));
  const totalDeductions = sumOf(deductions);
  // 3. Net.
  return {
    id: i.id,
    runId: i.runId,
    period: i.period,
    staffId: i.staff.staffId,
    staffName: i.staff.name,
    staffNumber: i.staff.staffNumber,
    department: i.staff.department,
    basic: i.profile.basic,
    earnings,
    gross,
    deductions,
    totalDeductions,
    net: gross - totalDeductions,
    employer,
    adjustments: i.adjustments,
    bonusIds: i.bonuses.map((b) => b.bonusId),
    advanceLines: i.advances,
  };
}
