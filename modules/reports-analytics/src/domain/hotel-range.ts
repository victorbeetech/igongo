/**
 * Turns hotel days (`YYYY-MM-DD`, Kampala time, `to` included) into a time
 * range. Kampala is UTC+3 all year (no summer time).
 */

import { hotelDate } from "@igongo/core";

/** Midnight in Kampala at the start of [day], as a UTC time. */
const startOf = (day: string) => new Date(`${day}T00:00:00+03:00`);

export function hotelRange(now: Date, days: number, from?: string, to?: string): { from: Date; to: Date; fromDay: string; toDay: string } {
  const toDay = to ?? hotelDate(now);
  const fromDay = from ?? hotelDate(new Date(startOf(toDay).getTime() - (days - 1) * 86_400_000 + 3_600_000));
  return { from: startOf(fromDay), to: new Date(startOf(toDay).getTime() + 86_400_000), fromDay, toDay };
}
