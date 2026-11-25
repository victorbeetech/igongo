/**
 * The super admin's attendance rules (S25-11). Kept as data so they change
 * without code.
 */

import { hotelTime } from "@igongo/core";

export interface AttendanceRules {
  /** When the working day starts, `HH:MM` hotel time. */
  dayStartsAt: string;
  /** Minutes after the start before a clock-in counts as late. */
  graceMinutes: number;
  /** Whether staff may clock in from their own phone, or only at a station. */
  allowAppClock: boolean;
  /** Taps closer together than this are ignored as double taps. */
  doubleTapSeconds: number;
}

/** The rules until the super admin changes them. */
export const DEFAULT_RULES: AttendanceRules = { dayStartsAt: "08:00", graceMinutes: 10, allowAppClock: true, doubleTapSeconds: 60 };

/** Minutes since midnight of `HH:MM`. */
function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** True when a first clock-in at [at] is late under [rules]. */
export function isLate(rules: AttendanceRules, at: Date): boolean {
  return minutesOf(hotelTime(at)) > minutesOf(rules.dayStartsAt) + rules.graceMinutes;
}
