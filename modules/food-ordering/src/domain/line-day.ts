/**
 * The day a guest wants a cart line: it must be the hotel's today or later,
 * and no further ahead than the guest app's date picker allows (60 days).
 * The hotel keeps Uganda time (UTC+3, no daylight saving), so "today" is
 * taken in that zone, not the server's.
 */

import { AppError } from "@igongo/core";

/** How many days ahead a line may be booked (matches the app's date picker). */
export const LINE_DAY_MAX_AHEAD = 60;

/** The hotel's calendar day for [now], as YYYY-MM-DD. */
export function hotelDayKey(now: Date): string {
  return new Date(now.getTime() + 3 * 3_600_000).toISOString().slice(0, 10);
}

/** The calendar day [days] after the YYYY-MM-DD string [day]. */
function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Checks a chosen line day.
 * @throws AppError 400 when the day is in the past or more than 60 days ahead
 */
export function checkLineDay(day: string, now: Date): void {
  const today = hotelDayKey(now);
  if (day < today) throw new AppError("bad_request", "Choose today or a later day for each item.");
  if (day > addDays(today, LINE_DAY_MAX_AHEAD)) throw new AppError("bad_request", `Items can be booked up to ${LINE_DAY_MAX_AHEAD} days ahead.`);
}
