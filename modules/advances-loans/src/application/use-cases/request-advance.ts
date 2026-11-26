/**
 * Use case: a staff member asks for an advance or a loan (S30-01). Steps:
 * check the super admin's rules, number it, save it as `requested`, audit it.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError, newId, recordChange } from "@igongo/core";
import { instalmentOf, isOpenAdvance, type Advance, type AdvanceKind } from "../../domain/advance";
import { requestBreak } from "../../domain/advance-rules";
import { nextMonth, payMonthOf } from "../../domain/pay-month";
import type { AdvancesDeps } from "../advances-deps";

export async function requestAdvance(deps: AdvancesDeps, staff: StaffRef, input: { kind: AdvanceKind; amount: number; instalments: number; reason: string }): Promise<Advance> {
  // 1. The rules, counting the person's open ones.
  const open = (await deps.advances.list({ staffId: staff.staffId, limit: 100 })).filter(isOpenAdvance).length;
  const broken = requestBreak(await deps.rules.read(), input, open);
  if (broken) throw new AppError("bad_request", broken);
  const now = deps.change.now;
  // 2. Recovery starts with next month's pay unless the approver says otherwise.
  const advance: Advance = {
    id: newId("adv"),
    number: await deps.advances.nextNumber(),
    staffId: staff.staffId,
    staffName: staff.name,
    department: staff.department,
    kind: input.kind,
    amount: input.amount,
    reason: input.reason,
    instalments: input.instalments,
    instalmentAmount: instalmentOf(input.amount, input.instalments),
    startPeriod: nextMonth(payMonthOf(now)),
    status: "requested",
    repaid: 0,
    requestedAt: now,
    decidedByName: null,
    decidedAt: null,
    decisionNote: null,
    disbursedByName: null,
    disbursedAt: null,
  };
  await deps.advances.save(advance);
  await recordChange(deps.change, { module: "advances-loans", action: "advance.requested", recordType: "advance", recordId: advance.id, summary: `${staff.name} asked for a ${input.kind} of ${input.amount} UGX (${advance.number})` });
  return advance;
}
