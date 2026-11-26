/**
 * Bonuses & Rewards' contracts for other modules: `CashBonusSource` (Payroll
 * adds approved cash bonuses to pay) and `BonusHistory` (Earnings Statements).
 */

import type { BonusHistory, CashBonusSource } from "@igongo/contracts/bonuses-rewards";
import { recordChange } from "@igongo/core";
import type { BonusesDeps } from "../application/bonuses-deps";

export function cashBonusSource(deps: BonusesDeps): CashBonusSource {
  return {
    unpaid: async () => (await deps.bonuses.list({ kind: "cash", status: "approved", limit: 10_000 })).map((b) => ({ bonusId: b.id, staffId: b.staffId, amount: b.amount, reason: b.reason })),
    async paid(ids, payRunId, at) {
      for (const id of ids) {
        const b = await deps.bonuses.get(id);
        // Only approved cash bonuses can be paid, and only once.
        if (!b || b.kind !== "cash" || b.status !== "approved") continue;
        await deps.bonuses.save({ ...b, status: "paid", payRunId, paidAt: at });
        await recordChange(deps.change, { module: "bonuses-rewards", action: "bonus.paid", recordType: "bonus", recordId: id, summary: `Paid ${b.staffName}'s bonus of ${b.amount} UGX with payroll` });
      }
    },
  };
}

export function bonusHistory(deps: BonusesDeps): BonusHistory {
  return {
    forStaff: async (staffId) =>
      (await deps.bonuses.list({ staffId, limit: 1000 })).map((b) => ({ bonusId: b.id, kind: b.kind, amount: b.amount, passes: b.passes, passesUsed: b.passesUsed, reason: b.reason, status: b.status, createdAt: b.createdAt })),
  };
}
