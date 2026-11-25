/**
 * One staff member's report for one day. Drafts can be changed; once sent
 * it waits for a supervisor, who signs it or returns it with a note.
 */

export const REPORT_STATUSES = ["draft", "submitted", "signed", "returned"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

/** One answered section of the template, such as "What I did today". */
export interface ReportSection {
  title: string;
  text: string;
}

export interface DailyReport {
  id: string;
  staffId: string;
  /** The writer's department when they wrote it. */
  department: string | null;
  /** The hotel day it covers, YYYY-MM-DD. */
  workDate: string;
  status: ReportStatus;
  sections: ReportSection[];
  /** Photos of faults or work (Files & Media links). */
  photoUrls: string[];
  submittedAt: Date | null;
  /** Who signed or returned it (a user ID), when and why. */
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** True when the writer may still change the report. */
export function isEditable(report: Pick<DailyReport, "status">): boolean {
  return report.status === "draft" || report.status === "returned";
}
