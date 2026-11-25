/** A comment on a daily report, by the writer or a supervisor. */

export interface ReportComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: Date;
}
