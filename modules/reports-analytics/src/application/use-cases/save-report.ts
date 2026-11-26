/**
 * Use cases: save, change and remove a saved report (S81-02). Every change
 * is recorded in the Audit Trail.
 */

import { recordChange, type ChangeContext } from "@igongo/core";
import type { SavedReport, SavedReportInput } from "../../domain/saved-report";
import type { SavedReportStore } from "../ports/saved-report-store";

/** Saves a new report for the caller. */
export async function createReport(store: SavedReportStore, change: ChangeContext, input: SavedReportInput): Promise<SavedReport> {
  const report: SavedReport = { ...input, id: crypto.randomUUID(), ownerId: change.actorId ?? "system", ownerName: change.actorName ?? "System", createdAt: change.now, lastRunAt: null };
  await store.create(report);
  await recordChange(change, { module: "reports-analytics", action: "report.saved", recordType: "saved-report", recordId: report.id, summary: `Saved the report "${report.name}" (${report.schedule})` });
  return report;
}

/** Changes [report] to [input]. */
export async function updateReport(store: SavedReportStore, change: ChangeContext, report: SavedReport, input: SavedReportInput): Promise<SavedReport> {
  await store.update(report.id, input);
  await recordChange(change, { module: "reports-analytics", action: "report.changed", recordType: "saved-report", recordId: report.id, summary: `Changed the report "${input.name}" (${input.schedule})` });
  return { ...report, ...input };
}

/** Removes [report]; its past runs stay. */
export async function removeReport(store: SavedReportStore, change: ChangeContext, report: SavedReport): Promise<void> {
  await store.remove(report.id);
  await recordChange(change, { module: "reports-analytics", action: "report.removed", recordType: "saved-report", recordId: report.id, summary: `Removed the report "${report.name}"` });
}
