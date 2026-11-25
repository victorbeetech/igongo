/**
 * Use case: a staff member writes or changes their report for a day, and
 * optionally sends it (S38-02). Signed and waiting reports are locked.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import { isEditable, type DailyReport, type ReportSection } from "../../domain/daily-report";
import type { ReportsDeps } from "../reports-deps";

export interface SaveReportInput {
  workDate: string;
  sections: ReportSection[];
  photoUrls?: string[];
  /** Send it for sign-off now. */
  submit: boolean;
}

/** @throws AppError `bad_request` for a future day, `conflict` when the report is locked */
export async function saveMyReport(deps: ReportsDeps, me: StaffRef, input: SaveReportInput): Promise<DailyReport> {
  const now = deps.change.now;
  // 1. Reports are about today or earlier.
  if (input.workDate > hotelDate(now)) throw new AppError("bad_request", "You cannot report on a day that has not happened.");
  const existing = await deps.reports.forDay(me.staffId, input.workDate);
  if (existing && !isEditable(existing)) throw new AppError("conflict", `This report is already ${existing.status}.`);
  // 2. Save the new version.
  const report: DailyReport = {
    id: existing?.id ?? newId("drp"),
    staffId: me.staffId,
    department: me.department,
    workDate: input.workDate,
    status: input.submit ? "submitted" : (existing?.status ?? "draft"),
    sections: input.sections,
    photoUrls: input.photoUrls ?? existing?.photoUrls ?? [],
    submittedAt: input.submit ? now : (existing?.submittedAt ?? null),
    reviewedBy: existing?.reviewedBy ?? null,
    reviewedAt: existing?.reviewedAt ?? null,
    reviewNote: existing?.reviewNote ?? null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await deps.reports.save(report);
  // 3. Sending is recorded; drafts are not (they change often).
  if (input.submit) await recordChange(deps.change, { module: "daily-reports", action: "report.submitted", recordType: "daily_report", recordId: report.id, summary: `${me.name} sent the daily report for ${input.workDate}` });
  return report;
}
