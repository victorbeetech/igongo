/**
 * The super admin's manual adjustment: give points to a guest (with a note),
 * or take points away. Taking away uses the same oldest-first rule as spending.
 */

import { AppError, recordChange } from "@igongo/core";
import { expiryFor } from "../../domain/rules";
import { spendOldestFirst, type PointsLot } from "../../domain/points-lot";
import type { PointsEvent } from "../../domain/points-event";
import type { PointsDeps } from "../points-deps";
import { readRules } from "./rules";

/** The adjustment as the admin screen sends it. [points] is signed: positive adds, negative takes away. */
export interface AdjustInput {
  guestId: string;
  points: number;
  note: string;
  /** A unique key for this adjustment, so a double submit is not applied twice. */
  key: string;
}

/** Applies one adjustment and records it in the audit trail. Returns false when the same key was already applied. */
export async function adjustPoints(deps: PointsDeps, input: AdjustInput): Promise<boolean> {
  const { store, change } = deps;
  if (input.points === 0) throw new AppError("bad_request", "Enter a number of points other than zero.");
  const sourceRef = `adjust:${input.key}`;
  if (await store.hasSource(sourceRef)) return false;

  const rules = await readRules(deps);
  let lots: PointsLot[];
  if (input.points > 0) {
    // Adding: a new lot that expires under the current rules, like any earned points.
    lots = [{
      id: crypto.randomUUID(), guestId: input.guestId, earned: input.points, remaining: input.points,
      earnedAt: change.now, expiresAt: expiryFor(rules, change.now), sourceRef,
    }];
  } else {
    // Taking away: spend oldest first; refuse when the guest does not have enough.
    const spend = spendOldestFirst(await store.lotsOf(input.guestId), -input.points, change.now);
    if (!spend) throw new AppError("bad_request", "The guest does not have that many points to take away.");
    lots = spend.changed;
  }

  const event: PointsEvent = {
    id: crypto.randomUUID(), guestId: input.guestId, kind: "adjust", points: input.points, sourceRef,
    note: input.note, createdAt: change.now,
  };
  await store.commit({ lots, events: [event] });
  await recordChange(change, {
    module: "points-rewards",
    action: "points.adjusted",
    recordType: "points_wallet",
    recordId: input.guestId,
    summary: `Points adjusted by ${input.points}: ${input.note}`,
  });
  return true;
}
