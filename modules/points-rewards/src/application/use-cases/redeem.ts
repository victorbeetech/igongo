/**
 * Spending points on an order. Points are taken oldest first, and the same
 * order reference can spend them only once, so a retried checkout never
 * takes points twice.
 */

import { AppError } from "@igongo/core";
import { spendOldestFirst } from "../../domain/points-lot";
import { valueOfPoints } from "../../domain/rules";
import type { PointsEvent } from "../../domain/points-event";
import type { PointsDeps } from "../points-deps";
import { readRules } from "./rules";

/** What a spend did: the points taken and what they are worth, and whether this call did it (false on a retry). */
export interface RedeemResult {
  points: number;
  valueUgx: number;
  applied: boolean;
}

/**
 * Spends [points] from the guest's wallet against [orderRef]. Refuses when the
 * programme is off, when the amount is under the minimum, or when the guest
 * does not have enough usable points.
 */
export async function redeemPoints(deps: PointsDeps, input: { guestId: string; points: number; orderRef: string }): Promise<RedeemResult> {
  const { store, change } = deps;
  const rules = await readRules(deps);
  if (!rules.enabled) throw new AppError("module_disabled", "Points are switched off for now.");
  if (input.points < rules.minimumToRedeem) {
    throw new AppError("bad_request", `You need at least ${rules.minimumToRedeem} points to spend.`);
  }

  const sourceRef = `redeem:${input.orderRef}`;
  // Already spent for this order: report it, spend nothing more.
  if (await store.hasSource(sourceRef)) {
    return { points: input.points, valueUgx: valueOfPoints(rules, input.points), applied: false };
  }

  const lots = await store.lotsOf(input.guestId);
  const spend = spendOldestFirst(lots, input.points, change.now);
  if (!spend) throw new AppError("bad_request", "You do not have enough points for this.");

  const event: PointsEvent = {
    id: crypto.randomUUID(),
    guestId: input.guestId,
    kind: "redeem",
    points: -input.points,
    sourceRef,
    note: `Spent on order ${input.orderRef}`,
    createdAt: change.now,
  };
  await store.commit({ lots: spend.changed, events: [event] });
  return { points: input.points, valueUgx: valueOfPoints(rules, input.points), applied: true };
}
