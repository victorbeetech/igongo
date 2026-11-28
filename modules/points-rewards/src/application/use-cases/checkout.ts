/**
 * Points at checkout and on cancelled orders:
 *  - `pointsValue`: what some points are worth, checked the same way spending is
 *  - `reverseForOrder`: puts back what a cancelled order took or earned, once
 *    (spent points are returned as a new lot; earned points are taken back,
 *    up to what the guest still has, so an order never leaves points negative)
 */

import { AppError } from "@igongo/core";
import { spendOldestFirst, type PointsLot } from "../../domain/points-lot";
import type { PointsEvent } from "../../domain/points-event";
import { expiryFor, valueOfPoints } from "../../domain/rules";
import type { PointsDeps } from "../points-deps";
import { readRules } from "./rules";

/** Shillings [points] are worth, refusing while the programme is off or under the minimum. */
export async function pointsValue(deps: PointsDeps, points: number): Promise<number> {
  const rules = await readRules(deps);
  if (!rules.enabled) throw new AppError("module_disabled", "Points are switched off for now.");
  if (points < rules.minimumToRedeem) throw new AppError("bad_request", `You need at least ${rules.minimumToRedeem} points to spend.`);
  return valueOfPoints(rules, points);
}

/**
 * Reverses what [orderRef] did to a guest's points. Safe to run twice: each
 * reversal is keyed by the order, and a second run finds it already done.
 * It runs even while the programme is off, so no guest loses points by it.
 */
export async function reverseForOrder(deps: PointsDeps, guestId: string, orderRef: string): Promise<void> {
  const { store, change } = deps;
  const rules = await readRules(deps);

  // 1. Points the order took: put them back as a new lot.
  const spent = await store.eventBySource(`redeem:${orderRef}`);
  const refundRef = `refund:${orderRef}`;
  if (spent && !(await store.hasSource(refundRef))) {
    const back: PointsLot = {
      id: crypto.randomUUID(), guestId, earned: -spent.points, remaining: -spent.points,
      earnedAt: change.now, expiresAt: expiryFor(rules, change.now), sourceRef: refundRef,
    };
    await store.commit({ lots: [back], events: [historyLine(guestId, -spent.points, refundRef, `Order ${orderRef} cancelled: points returned`, change.now)] });
  }

  // 2. Points the order earned: take back what the guest still has, at most what was earned.
  const earned = await store.eventBySource(`order:${orderRef}`);
  const takeRef = `reverse-earn:${orderRef}`;
  if (earned && !(await store.hasSource(takeRef))) {
    // Take all of it when possible; otherwise take what is left (the rest was already spent).
    const taken = partialSpend(await store.lotsOf(guestId), earned.points, change.now);
    if (taken.amount > 0) {
      await store.commit({ lots: taken.changed, events: [historyLine(guestId, -taken.amount, takeRef, `Order ${orderRef} cancelled: points taken back`, change.now)] });
    }
  }
}

/** Takes as many points as there are, up to [points], from usable lots, oldest first. */
function partialSpend(lots: PointsLot[], points: number, now: Date): { changed: PointsLot[]; amount: number } {
  const usable = lots.filter((l) => l.remaining > 0 && (l.expiresAt === null || l.expiresAt.getTime() > now.getTime()));
  const available = usable.reduce((s, l) => s + l.remaining, 0);
  const amount = Math.min(points, available);
  if (amount === 0) return { changed: [], amount: 0 };
  // Spend exactly `amount`, which is always covered by the usable balance.
  const spend = spendOldestFirst(lots, amount, now);
  return { changed: spend?.changed ?? [], amount };
}

/** A history line for a reversal, kept as an "adjust" so it reads as a manual change in the history. */
function historyLine(guestId: string, points: number, sourceRef: string, note: string, at: Date): PointsEvent {
  return { id: crypto.randomUUID(), guestId, kind: "adjust", points, sourceRef, note, createdAt: at };
}
