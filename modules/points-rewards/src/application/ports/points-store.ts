/** Where points rules, lots and history are kept. The infrastructure implements it. */

import type { PointsEvent } from "../../domain/points-event";
import type { PointsLot } from "../../domain/points-lot";
import type { PointsRules } from "../../domain/rules";

/** One batch of writes that must land together: lots and their history. */
export interface PointsCommit {
  /** Lots to insert or update (their `remaining` after the change). */
  lots: PointsLot[];
  /** History lines to add. */
  events: PointsEvent[];
}

export interface PointsStore {
  /** The saved rules, or the starting rules before anything is saved. */
  readRules(): Promise<PointsRules>;
  /** Replaces the rules, recording who saved them and when. */
  writeRules(rules: PointsRules, by: string | null, now: Date): Promise<void>;
  /** Every lot a guest has, spent or not. */
  lotsOf(guestId: string): Promise<PointsLot[]>;
  /** Lots with points left whose expiry date has passed at [now]. */
  lotsDueForExpiry(now: Date): Promise<PointsLot[]>;
  /** True when a history line with this source is already recorded (so a retry never adds points twice). */
  hasSource(sourceRef: string): Promise<boolean>;
  /** A guest's newest history lines, newest first, at most [limit]. */
  eventsOf(guestId: string, limit: number): Promise<PointsEvent[]>;
  /** Saves lots and history together, in one transaction. */
  commit(change: PointsCommit): Promise<void>;
}
