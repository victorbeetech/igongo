/** Where daily reports and their comments are kept. */

import type { DailyReport, ReportStatus } from "../../domain/daily-report";
import type { ReportComment } from "../../domain/report-comment";

export interface ReportFilter {
  from: string;
  to: string;
  status?: ReportStatus;
  staffId?: string;
  department?: string;
  limit: number;
}

export interface ReportRepository {
  get(id: string): Promise<DailyReport | null>;
  forDay(staffId: string, workDate: string): Promise<DailyReport | null>;
  list(filter: ReportFilter): Promise<DailyReport[]>;
  save(report: DailyReport): Promise<void>;
  comments(reportId: string): Promise<ReportComment[]>;
  addComment(comment: ReportComment): Promise<void>;
}
