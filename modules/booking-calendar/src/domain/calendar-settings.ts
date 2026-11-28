/**
 * The booking calendar's settings, which the super admin changes in the app
 * without code. Saved as one value under the key `calendar`.
 */

import type { FullRule } from "./day-status";

export interface CalendarSettings {
  /** Whether guests see the calendar at all. Off hides it everywhere. */
  enabled: boolean;
  /** Weekdays the hotel takes bookings (0 = Sunday ... 6 = Saturday). */
  openWeekdays: number[];
  /** What counts as "Spots full" (see day-status.ts). */
  fullRule: FullRule;
  /** How many days ahead guests can see, from 1 to 365. */
  windowDays: number;
}

/** Used until the super admin saves settings. Open every day, full only when every room is taken. */
export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  enabled: true,
  openWeekdays: [0, 1, 2, 3, 4, 5, 6],
  fullRule: "every_offering",
  windowDays: 60,
};
