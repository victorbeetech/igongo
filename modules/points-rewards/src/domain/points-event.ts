/**
 * A points event: one line in a guest's points history. Every change to a
 * balance is an event, so the history always adds up.
 */

/**
 * What kind of change an event records:
 *  - `earn`:   points from a paid order
 *  - `bonus`:  points given free (the sign-up bonus)
 *  - `adjust`: a super admin's manual change, up or down, with a note
 *  - `redeem`: points spent on an order
 *  - `expire`: points that ran out
 */
export type PointsEventKind = "earn" | "bonus" | "adjust" | "redeem" | "expire";

/** One entry in a guest's points history. */
export interface PointsEvent {
  /** Unique ID of the event. */
  id: string;
  /** The guest's user ID. */
  guestId: string;
  /** What happened. */
  kind: PointsEventKind;
  /** Signed: positive when points are added, negative when they leave. */
  points: number;
  /** The event that caused this change, unique per change so a retry never repeats it. */
  sourceRef: string;
  /** A short plain note shown in the history (for example "Order PRE-0042"). */
  note: string;
  /** When it happened. */
  createdAt: Date;
}
