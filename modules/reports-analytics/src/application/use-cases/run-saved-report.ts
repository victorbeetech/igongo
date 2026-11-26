/**
 * Use case: run a saved report (S81-03). Reads the dashboard over the
 * report's days from the given sources, keeps only the report's areas and
 * stores the snapshot. A scheduled run covers the days up to yesterday, so
 * the 7 AM report is never a half-empty today; a run by hand includes today.
 */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { hotelDate, recordChange, type ChangeContext } from "@igongo/core";
import { hotelRange } from "../../domain/hotel-range";
import type { ReportRun, RunTrigger } from "../../domain/report-run";
import type { SavedReport } from "../../domain/saved-report";
import type { SavedReportStore } from "../ports/saved-report-store";
import { readDashboard } from "./read-dashboard";

export async function runSavedReport(
  store: SavedReportStore,
  sources: KpiSource[],
  hidden: string[],
  report: SavedReport,
  trigger: RunTrigger,
  change: ChangeContext,
): Promise<ReportRun> {
  // 1. The days: up to today by hand, up to yesterday on schedule.
  const lastDay = trigger === "schedule" ? hotelDate(new Date(change.now.getTime() - 86_400_000)) : undefined;
  const range = hotelRange(change.now, report.days, undefined, lastDay);
  // 2. Only the report's areas (all of them when it names none).
  const picked = report.modules.length ? sources.filter((s) => report.modules.includes(s.module)) : sources;
  const groups = await readDashboard(picked, range, hidden);
  // 3. Keep the snapshot and record the run.
  const run: ReportRun = { id: crypto.randomUUID(), reportId: report.id, reportName: report.name, fromDay: range.fromDay, toDay: range.toDay, trigger, groups, ranAt: change.now };
  await store.addRun(run);
  await recordChange(change, { module: "reports-analytics", action: "report.ran", recordType: "saved-report", recordId: report.id, summary: `Ran "${report.name}" for ${run.fromDay} to ${run.toDay}` });
  return run;
}
