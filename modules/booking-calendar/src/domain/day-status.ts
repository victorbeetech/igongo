/**
 * The calendar's rule for one day: `open`, `spots_full` or `closed`. Pure:
 * no database and no clock. The caller passes in the facts and this decides.
 */

import { weekdayOf } from "./calendar-dates";

/** What guests see for a day. */
export type DayStatus = "open" | "spots_full" | "closed";

/**
 * How "full" is judged across the rooms or slots sold that day:
 *   every_offering: full only when every room or slot is taken (the default);
 *   any_offering:   full as soon as one room or slot is taken.
 */
export const FULL_RULES = ["every_offering", "any_offering"] as const;
export type FullRule = (typeof FULL_RULES)[number];

/** The facts the rule needs about one day. */
export interface DayFacts {
  /** The day being judged, `YYYY-MM-DD`. */
  date: string;
  /** Hotel's today, `YYYY-MM-DD`. Days before it are closed. */
  today: string;
  /** Weekdays the hotel takes bookings (0 = Sunday ... 6 = Saturday). */
  openWeekdays: number[];
  /** Units left for each room or slot sold on this day. `Infinity` means no limit. */
  left: number[];
  /** Which rule decides "full". */
  fullRule: FullRule;
}

/**
 * Decides the status of one day, in this order:
 *   1. a past day is closed;
 *   2. a weekday the hotel does not open is closed;
 *   3. a day with nothing sold is closed;
 *   4. otherwise it is spots_full when the full rule says every (or any)
 *      room or slot is taken, else open.
 */
export function dayStatus(f: DayFacts): DayStatus {
  // 1. Past days can no longer be booked.
  if (f.date < f.today) return "closed";
  // 2. The super admin can close weekdays such as Monday.
  if (!f.openWeekdays.includes(weekdayOf(f.date))) return "closed";
  // 3. Nothing is sold on this day, so there is nothing to show as open or full.
  if (f.left.length === 0) return "closed";
  // 4. "Full" means no units left: every one of them, or any one, per the rule.
  const isEmpty = (n: number) => n <= 0;
  const full = f.fullRule === "any_offering" ? f.left.some(isEmpty) : f.left.every(isEmpty);
  return full ? "spots_full" : "open";
}
