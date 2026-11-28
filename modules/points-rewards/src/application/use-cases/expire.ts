/**
 * Expiry: takes away the unspent points of every lot whose date has passed,
 * and writes one "expire" line per lot so the guest's history explains it.
 */

import type { PointsEvent } from "../../domain/points-event";
import type { PointsDeps } from "../points-deps";

/** What one expiry run did. */
export interface ExpiryResult {
  lots: number;
  points: number;
}

/** Expires every lot due at the current time. Safe to run again: an expired lot has nothing left to expire. */
export async function expireDue(deps: PointsDeps): Promise<ExpiryResult> {
  const { store, change } = deps;
  const due = await store.lotsDueForExpiry(change.now);
  if (due.length === 0) return { lots: 0, points: 0 };

  // Each expired lot goes to zero and gets its own history line.
  const expired = due.map((lot) => ({ ...lot, remaining: 0 }));
  const events: PointsEvent[] = due.map((lot) => ({
    id: crypto.randomUUID(),
    guestId: lot.guestId,
    kind: "expire",
    points: -lot.remaining,
    sourceRef: `expire:${lot.id}`,
    note: "Points expired",
    createdAt: change.now,
  }));
  await store.commit({ lots: expired, events });
  return { lots: due.length, points: due.reduce((s, l) => s + l.remaining, 0) };
}
