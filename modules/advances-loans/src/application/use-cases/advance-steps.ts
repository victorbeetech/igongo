/**
 * Use cases for the rest of an advance's life (S30-02 to S30-04): cancel,
 * decide, disburse, and take a cash repayment. Each step checks the status
 * it starts from and is audited.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import { balanceOf, instalmentOf, type Advance, type AdvanceStatus } from "../../domain/advance";
import type { AdvancesDeps } from "../advances-deps";

/** Saves [next] and records [summary]. */
async function step(deps: AdvancesDeps, next: Advance, action: string, summary: string): Promise<Advance> {
  await deps.advances.save(next);
  await recordChange(deps.change, { module: "advances-loans", action: `advance.${action}`, recordType: "advance", recordId: next.id, summary });
  return next;
}

/** @throws AppError `conflict` unless [advance] is in one of [statuses] */
function mustBe(advance: Advance, ...statuses: AdvanceStatus[]) {
  if (!statuses.includes(advance.status)) throw new AppError("conflict", `This ${advance.kind} is ${advance.status}.`);
}

/** The staff member takes back their own request before it is decided. */
export async function cancelAdvance(deps: AdvancesDeps, advance: Advance): Promise<Advance> {
  mustBe(advance, "requested");
  return step(deps, { ...advance, status: "cancelled" }, "cancelled", `${advance.staffName} cancelled ${advance.number}`);
}

/** A manager approves (maybe changing the months and first month) or declines. */
export async function decideAdvance(deps: AdvancesDeps, advance: Advance, by: string, input: { approve: boolean; note: string | null; instalments?: number; startPeriod?: string }): Promise<Advance> {
  mustBe(advance, "requested");
  const instalments = input.instalments ?? advance.instalments;
  const next: Advance = {
    ...advance,
    status: input.approve ? "approved" : "declined",
    instalments,
    instalmentAmount: instalmentOf(advance.amount, instalments),
    startPeriod: input.startPeriod ?? advance.startPeriod,
    decidedByName: by,
    decidedAt: deps.change.now,
    decisionNote: input.note,
  };
  return step(deps, next, input.approve ? "approved" : "declined", `${by} ${input.approve ? "approved" : "declined"} ${advance.number} for ${advance.staffName}${input.note ? `: ${input.note}` : ""}`);
}

/** Finance hands the money over; payroll starts taking instalments. */
export async function disburseAdvance(deps: AdvancesDeps, advance: Advance, by: string): Promise<Advance> {
  mustBe(advance, "approved");
  return step(deps, { ...advance, status: "disbursed", disbursedByName: by, disbursedAt: deps.change.now }, "disbursed", `${by} paid out ${advance.number} (${advance.amount} UGX) to ${advance.staffName}`);
}

/** The staff member pays some back in cash. */
export async function repayInCash(deps: AdvancesDeps, advance: Advance, amount: number, by: string, period: string): Promise<Advance> {
  mustBe(advance, "disbursed");
  if (amount > balanceOf(advance)) throw new AppError("bad_request", `Only ${balanceOf(advance)} UGX is still owed.`);
  await deps.advances.addRepayment({ id: newId("rep"), advanceId: advance.id, period, amount, payRunId: null, byName: by, at: deps.change.now });
  const repaid = advance.repaid + amount;
  return step(deps, { ...advance, repaid, status: repaid >= advance.amount ? "repaid" : "disbursed" }, "repaid_cash", `${by} took ${amount} UGX in cash on ${advance.number}`);
}
