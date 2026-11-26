/**
 * The first hotel day of the period [date] falls in: the day itself for a
 * daily checklist, the Monday for a weekly one. Used to tell whether a
 * checklist is already done.
 */

import type { Frequency } from "../../domain/checklist";

export function periodStart(date: string, frequency: Frequency): string {
  if (frequency === "daily") return date;
  const d = new Date(`${date}T00:00:00Z`);
  // getUTCDay: Sunday 0 ... Saturday 6; step back to Monday.
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
