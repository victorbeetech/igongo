/** Pay months, `YYYY-MM`: the next one after a date, and comparing them. */

import { hotelDate } from "@igongo/core";

/** The pay month [date] falls in, in hotel time. */
export const payMonthOf = (date: Date) => hotelDate(date).slice(0, 7);

/** The month after [period]. */
export function nextMonth(period: string): string {
  const [y, m] = period.split("-").map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}
