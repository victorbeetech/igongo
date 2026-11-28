/**
 * Points coming in: from a paid order, and the sign-up bonus. Each call is
 * keyed by its source reference, so a retry (a payment webhook sent twice,
 * a double tap) never adds the same points twice.
 */

import { expiryFor, pointsForSpend } from "../../domain/rules";
import type { PointsLot } from "../../domain/points-lot";
import type { PointsEvent, PointsEventKind } from "../../domain/points-event";
import type { PointsDeps } from "../points-deps";
import { readRules } from "./rules";

/**
 * Adds [points] to a guest as one new lot plus its history line. Shared by
 * every way points come in. Returns the points added (0 when nothing was added).
 */
async function addPoints(
  deps: PointsDeps,
  input: { guestId: string; points: number; kind: Extract<PointsEventKind, "earn" | "bonus">; sourceRef: string; note: string },
): Promise<number> {
  const { store, change } = deps;
  // Nothing to add, or already added before: do nothing.
  if (input.points <= 0) return 0;
  if (await store.hasSource(input.sourceRef)) return 0;

  const rules = await readRules(deps);
  const earnedAt = change.now;
  // The lot keeps the expiry date it was given on the day it was earned.
  const lot: PointsLot = {
    id: crypto.randomUUID(),
    guestId: input.guestId,
    earned: input.points,
    remaining: input.points,
    earnedAt,
    expiresAt: expiryFor(rules, earnedAt),
    sourceRef: input.sourceRef,
  };
  const event: PointsEvent = {
    id: crypto.randomUUID(),
    guestId: input.guestId,
    kind: input.kind,
    points: input.points,
    sourceRef: input.sourceRef,
    note: input.note,
    createdAt: earnedAt,
  };
  await store.commit({ lots: [lot], events: [event] });
  return input.points;
}

/**
 * Earns points on a paid order of [amountUgx]. Returns the points earned.
 * Earns nothing while the programme is switched off, so turning it on later
 * never gives back points for old orders.
 */
export async function earnForPurchase(deps: PointsDeps, input: { guestId: string; amountUgx: number; orderRef: string }): Promise<number> {
  const rules = await readRules(deps);
  if (!rules.enabled) return 0;
  return addPoints(deps, {
    guestId: input.guestId,
    points: pointsForSpend(rules, input.amountUgx),
    kind: "earn",
    sourceRef: `order:${input.orderRef}`,
    note: `Order ${input.orderRef}`,
  });
}

/** Gives the sign-up bonus once per guest. Returns the points given. */
export async function grantSignupBonus(deps: PointsDeps, guestId: string): Promise<number> {
  const rules = await readRules(deps);
  if (!rules.enabled) return 0;
  return addPoints(deps, { guestId, points: rules.signupBonus, kind: "bonus", sourceRef: `signup:${guestId}`, note: "Welcome bonus" });
}
