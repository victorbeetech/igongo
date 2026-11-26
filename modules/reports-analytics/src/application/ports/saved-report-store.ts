/** Where saved reports and their runs are kept. */

import type { ReportRun, ReportRunSummary } from "../../domain/report-run";
import type { SavedReport, SavedReportInput } from "../../domain/saved-report";

export interface SavedReportStore {
  /** Reports, newest first; only [ownerId]'s when given, everyone's when null. */
  list(ownerId: string | null): Promise<SavedReport[]>;
  get(id: string): Promise<SavedReport | null>;
  /** Every report with a schedule, for the 7 AM run. */
  scheduled(): Promise<SavedReport[]>;
  create(report: SavedReport): Promise<void>;
  update(id: string, input: SavedReportInput): Promise<void>;
  /** Removes the report; its past runs stay readable from the run list. */
  remove(id: string): Promise<void>;
  /** Keeps [run] and stamps the report's last run time. */
  addRun(run: ReportRun): Promise<void>;
  runsOf(reportId: string, limit: number): Promise<ReportRunSummary[]>;
  getRun(id: string): Promise<ReportRun | null>;
}
