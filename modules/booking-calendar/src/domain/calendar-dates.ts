/**
 * Date helpers for the booking calendar. Dates are plain `YYYY-MM-DD` hotel
 * days, so they are handled in UTC here to avoid time-zone drift. Pure code.
 */

/** Day of the week for a `YYYY-MM-DD` date: 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(date: string): number {
  // Parsing at midnight UTC keeps the weekday the same in every time zone.
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** The date [days] after [date], as `YYYY-MM-DD`. Negative values go back. */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** [count] consecutive dates starting at [from], in order. */
export function dateRange(from: string, count: number): string[] {
  // Build each day from the start so the list never skips or repeats one.
  return Array.from({ length: count }, (_, i) => addDays(from, i));
}
