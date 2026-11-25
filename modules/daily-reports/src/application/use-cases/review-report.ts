/** Use case: a supervisor signs a report or returns it with a note (S38-03, S38-06). */

import { AppError, recordChange } from "@igongo/core";
import type { DailyReport } from "../../domain/daily-report";
import type { ReportsDeps } from "../reports-deps";

/** @throws AppError `conflict` unless the report is waiting, `bad_request` when returning without a note */
export async function reviewReport(deps: ReportsDeps, report: DailyReport, input: { decision: "signed" | "returned"; note?: string }): Promise<DailyReport> {
  if (report.status !== "submitted") throw new AppError("conflict", "Only reports waiting for sign-off can be signed or returned.");
  if (input.decision === "returned" && !input.note) throw new AppError("bad_request", "Say what to change when returning a report.");
  const now = deps.change.now;
  const reviewed: DailyReport = { ...report, status: input.decision, reviewedBy: deps.change.actorId, reviewedAt: now, reviewNote: input.note ?? null, updatedAt: now };
  await deps.reports.save(reviewed);
  await recordChange(deps.change, {
    module: "daily-reports",
    action: `report.${input.decision}`,
    recordType: "daily_report",
    recordId: report.id,
    summary: `${input.decision === "signed" ? "Signed" : "Returned"} the daily report for ${report.workDate}${input.note ? `: ${input.note}` : ""}`,
  });
  return reviewed;
}
