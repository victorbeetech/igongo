/**
 * Advances & Loans' contracts for other modules: `AdvanceRecovery` (Payroll
 * takes each month's instalments) and `AdvanceHistory` (Earnings Statements).
 */

import type { AdvanceHistory, AdvanceRecovery } from "@igongo/contracts/advances-loans";
import { newId, recordChange } from "@igongo/core";
import type { AdvancesDeps } from "../application/advances-deps";
import { balanceOf } from "../domain/advance";

export function advanceRecovery(deps: AdvancesDeps): AdvanceRecovery {
  return {
    async dueFor(period) {
      const open = await deps.advances.repaying(period);
      const due = [];
      for (const a of open) {
        // One instalment per month, never more than what is left.
        if (await deps.advances.hasRepayment(a.id, period)) continue;
        due.push({ advanceId: a.id, number: a.number, staffId: a.staffId, amount: Math.min(a.instalmentAmount, balanceOf(a)) });
      }
      return due;
    },
    async recovered(lines, period, payRunId) {
      for (const line of lines) {
        const a = await deps.advances.get(line.advanceId);
        if (!a) continue;
        // Taking the same month twice does nothing.
        if (!(await deps.advances.addRepayment({ id: newId("rep"), advanceId: a.id, period, amount: line.amount, payRunId, byName: "Payroll", at: deps.change.now }))) continue;
        const repaid = a.repaid + line.amount;
        await deps.advances.save({ ...a, repaid, status: repaid >= a.amount ? "repaid" : a.status });
        await recordChange(deps.change, { module: "advances-loans", action: "advance.recovered", recordType: "advance", recordId: a.id, summary: `Payroll took ${line.amount} UGX on ${a.number} for ${period}` });
      }
    },
  };
}

export function advanceHistory(deps: AdvancesDeps): AdvanceHistory {
  return {
    forStaff: async (staffId) =>
      (await deps.advances.list({ staffId, limit: 1000 })).map((a) => ({ advanceId: a.id, number: a.number, kind: a.kind, amount: a.amount, repaid: a.repaid, status: a.status, requestedAt: a.requestedAt })),
  };
}
