/**
 * Use case: the 7 AM run of every scheduled report that is due. One report
 * that fails is counted and skipped, so it never stops the others.
 */

import { isDue } from "../../domain/report-due";
import type { ReportsDeps } from "../reports-deps";
import { runSavedReport } from "./run-saved-report";

export interface DueRunReport {
  ran: number;
  failed: number;
}

export async function runDueReports(deps: ReportsDeps): Promise<DueRunReport> {
  // 1. The reports whose schedule says today.
  const due = (await deps.saved.scheduled()).filter((r) => isDue(r, deps.change.now));
  const { hidden } = await deps.settings.read();
  const report: DueRunReport = { ran: 0, failed: 0 };
  // 2. One at a time, so the database is never flooded.
  for (const r of due) {
    try {
      await runSavedReport(deps.saved, deps.sources, hidden, r, "schedule", deps.change);
      report.ran += 1;
    } catch {
      report.failed += 1;
    }
  }
  return report;
}
