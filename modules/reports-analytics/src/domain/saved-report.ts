/**
 * A saved report (S81-02): a named pick of dashboard areas over a number of
 * days, kept by its owner and, when scheduled, run by itself at 7 AM Kampala
 * time (daily, every Monday, or on the 1st of the month).
 */

/** How often a saved report runs by itself. `none` runs only on demand. */
export type ReportSchedule = "none" | "daily" | "weekly" | "monthly";

/** The schedules there are, for request checks and menus. */
export const REPORT_SCHEDULES: readonly ReportSchedule[] = ["none", "daily", "weekly", "monthly"];

/** How many days a report covers, the same choices as the dashboard. */
export type ReportDays = 1 | 7 | 30;

export interface SavedReport {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  /** Module keys of the areas in the report; empty means every area the owner may see. */
  modules: string[];
  days: ReportDays;
  schedule: ReportSchedule;
  createdAt: Date;
  /** When it last ran, by hand or by schedule; null before the first run. */
  lastRunAt: Date | null;
}

/** What the owner chooses when saving or changing a report. */
export type SavedReportInput = Pick<SavedReport, "name" | "modules" | "days" | "schedule">;
