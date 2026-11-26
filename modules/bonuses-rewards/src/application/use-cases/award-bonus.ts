/**
 * Use cases: award a bonus (S31-01) and decide on it (S31-02). Awards wait
 * for an approver when the super admin wants that; nobody decides their own.
 */

import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import type { Bonus, BonusKind } from "../../domain/bonus";
import type { BonusesDeps } from "../bonuses-deps";

/** The last day of [days] passes from [now], `YYYY-MM-DD`. */
const validUntil = (now: Date, days: number) => hotelDate(new Date(now.getTime() + days * 86_400_000));

export async function awardBonus(deps: BonusesDeps, by: string, input: { staffId: string; kind: BonusKind; amount: number; passes: number; reason: string }): Promise<Bonus> {
  const rules = await deps.rules.read();
  if (input.kind === "cash" ? !rules.cashEnabled : !rules.buffetEnabled) throw new AppError("method_disabled", `${input.kind === "cash" ? "Cash" : "Buffet"} bonuses are switched off.`);
  if (input.kind === "cash" ? input.amount <= 0 : input.passes <= 0) throw new AppError("bad_request", input.kind === "cash" ? "Give an amount." : "Give at least one buffet pass.");
  const staff = await deps.staff.byId(input.staffId);
  if (!staff || staff.status !== "active") throw new AppError("bad_request", "Choose an active staff member.");
  const now = deps.change.now;
  const bonus: Bonus = {
    id: newId("bon"),
    staffId: staff.staffId,
    staffName: staff.name,
    department: staff.department,
    kind: input.kind,
    amount: input.kind === "cash" ? input.amount : 0,
    passes: input.kind === "buffet" ? input.passes : 0,
    passesUsed: 0,
    validUntil: input.kind === "buffet" ? validUntil(now, rules.buffetValidDays) : null,
    reason: input.reason,
    status: rules.requireApproval ? "pending" : "approved",
    awardedByName: by,
    decidedByName: rules.requireApproval ? null : by,
    decidedAt: rules.requireApproval ? null : now,
    payRunId: null,
    paidAt: null,
    createdAt: now,
  };
  await deps.bonuses.save(bonus);
  const what = input.kind === "cash" ? `${input.amount} UGX` : `${input.passes} buffet passes`;
  await recordChange(deps.change, { module: "bonuses-rewards", action: "bonus.awarded", recordType: "bonus", recordId: bonus.id, summary: `${by} gave ${staff.name} ${what}: ${input.reason}` });
  return bonus;
}

export async function decideBonus(deps: BonusesDeps, bonus: Bonus, by: string, approve: boolean): Promise<Bonus> {
  if (bonus.status !== "pending") throw new AppError("conflict", `This bonus is ${bonus.status}.`);
  const next: Bonus = { ...bonus, status: approve ? "approved" : "declined", decidedByName: by, decidedAt: deps.change.now };
  await deps.bonuses.save(next);
  await recordChange(deps.change, { module: "bonuses-rewards", action: approve ? "bonus.approved" : "bonus.declined", recordType: "bonus", recordId: bonus.id, summary: `${by} ${approve ? "approved" : "declined"} ${bonus.staffName}'s bonus` });
  return next;
}
