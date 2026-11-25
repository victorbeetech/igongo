/**
 * Dates as the hotel sees them. The hotel is in Mbarara (East Africa Time,
 * UTC+3, no daylight saving), so "today" for attendance, meals and daily
 * reports turns over at local midnight, not UTC midnight.
 */

/** The hotel's time zone. Regional settings (module 1) will feed this later. */
export const HOTEL_TIME_ZONE = "Africa/Kampala";

/**
 * The hotel's calendar date of [instant], as `YYYY-MM-DD`.
 * @example hotelDate(new Date("2026-11-25T22:30:00Z")) === "2026-11-26"
 */
export function hotelDate(instant: Date, timeZone: string = HOTEL_TIME_ZONE): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

/**
 * The hotel's clock time of [instant], as `HH:MM` (24 hour).
 * @example hotelTime(new Date("2026-11-25T05:15:00Z")) === "08:15"
 */
export function hotelTime(instant: Date, timeZone: string = HOTEL_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(instant);
}
