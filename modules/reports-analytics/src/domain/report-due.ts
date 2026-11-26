/**
 * Whether a scheduled report should run now. Pure: the 7 AM cron asks for
 * every scheduled report. A report runs at most once per hotel day, and
 * weekly ones only on Mondays, monthly ones only on the 1st (Kampala time).
 */

import { hotelDate } from "@igongo/core";
import type { SavedReport } from "./saved-report";

/** The weekday (0 = Sunday) and day of month of [now] in Kampala (UTC+3). */
function kampalaDay(now: Date): { weekday: number; monthDay: number } {
  const k = new Date(now.getTime() + 3 * 3_600_000);
  return { weekday: k.getUTCDay(), monthDay: k.getUTCDate() };
}

export function isDue(report: Pick<SavedReport, "schedule" | "lastRunAt">, now: Date): boolean {
  if (report.schedule === "none") return false;
  // Already ran today (by hand or by schedule): wait for the next one.
  if (report.lastRunAt && hotelDate(report.lastRunAt) === hotelDate(now)) return false;
  const { weekday, monthDay } = kampalaDay(now);
  if (report.schedule === "weekly") return weekday === 1;
  if (report.schedule === "monthly") return monthDay === 1;
  return true;
}
