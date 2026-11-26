/**
 * One run of a saved report (S81-03): the numbers as they were, kept for
 * ever so a report from last month still reads the same today.
 */

import type { DashboardGroup } from "./dashboard-group";

/** Who started a run: a person, or the 7 AM schedule. */
export type RunTrigger = "manual" | "schedule";

export interface ReportRun {
  id: string;
  reportId: string;
  reportName: string;
  /** Hotel days covered, `to` included (YYYY-MM-DD). */
  fromDay: string;
  toDay: string;
  trigger: RunTrigger;
  groups: DashboardGroup[];
  ranAt: Date;
}

/** A run without its numbers, for lists. */
export type ReportRunSummary = Omit<ReportRun, "groups">;
