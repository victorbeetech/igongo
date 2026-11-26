/**
 * Builds every payslip of a pay run from today's data: active staff with an
 * active pay profile, their unpaid cash bonuses, the advance instalments due
 * for the month, and adjustments kept from the run's earlier payslips.
 */

import type { PayLine } from "@igongo/contracts/payroll";
import { newId } from "@igongo/core";
import { computePayslip } from "../../domain/compute-payslip";
import type { PayRun } from "../../domain/pay-run";
import type { Payslip } from "../../domain/payslip";
import type { PayrollDeps } from "../payroll-deps";

export async function buildPayslips(deps: PayrollDeps, run: Pick<PayRun, "id" | "period">, keep: Map<string, PayLine[]>): Promise<Payslip[]> {
  // 1. Who is paid: active profiles of active staff.
  const profiles = (await deps.payroll.profiles()).filter((p) => p.active);
  const staff = new Map((await deps.staff.byIds(profiles.map((p) => p.staffId))).filter((s) => s.status === "active").map((s) => [s.staffId, s]));
  // 2. What other modules add or take (nothing while they are off).
  const bonuses = (await deps.bonuses?.unpaid()) ?? [];
  const advances = (await deps.advances?.dueFor(run.period)) ?? [];
  const rules = (await deps.settings.read()).deductions;
  // 3. One payslip each.
  return profiles
    .flatMap((p) => {
      const s = staff.get(p.staffId);
      return s ? [{ p, s }] : [];
    })
    .map(({ p, s }) =>
      computePayslip({
        id: newId("psl"),
        runId: run.id,
        period: run.period,
        staff: { staffId: s.staffId, name: s.name, staffNumber: s.staffNumber, department: s.department },
        profile: p,
        bonuses: bonuses.filter((b) => b.staffId === p.staffId),
        advances: advances.filter((a) => a.staffId === p.staffId),
        adjustments: keep.get(p.staffId) ?? [],
        rules,
      }),
    )
    .sort((a, b) => a.staffName.localeCompare(b.staffName));
}
