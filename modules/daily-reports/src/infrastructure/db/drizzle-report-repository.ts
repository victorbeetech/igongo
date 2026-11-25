/** `ReportRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, asc, between, desc, eq } from "drizzle-orm";
import type { ReportFilter, ReportRepository } from "../../application/ports/report-repository";
import type { DailyReport } from "../../domain/daily-report";
import type { ReportComment } from "../../domain/report-comment";
import { dailyReports, reportComments } from "./schema";

export class DrizzleReportRepository implements ReportRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<DailyReport | null> {
    const [row] = await this.db.select().from(dailyReports).where(eq(dailyReports.id, id));
    return row ?? null;
  }

  async forDay(staffId: string, workDate: string): Promise<DailyReport | null> {
    const [row] = await this.db.select().from(dailyReports).where(and(eq(dailyReports.staffId, staffId), eq(dailyReports.workDate, workDate)));
    return row ?? null;
  }

  list(filter: ReportFilter): Promise<DailyReport[]> {
    const where = and(
      between(dailyReports.workDate, filter.from, filter.to),
      filter.status ? eq(dailyReports.status, filter.status) : undefined,
      filter.staffId ? eq(dailyReports.staffId, filter.staffId) : undefined,
      filter.department ? eq(dailyReports.department, filter.department) : undefined,
    );
    return this.db.select().from(dailyReports).where(where).orderBy(desc(dailyReports.workDate), asc(dailyReports.submittedAt)).limit(filter.limit);
  }

  async save(report: DailyReport): Promise<void> {
    // Insert, or replace the person's report for that day.
    // The ID never changes, so everything else is updated.
    const { status, sections, photoUrls, submittedAt, reviewedBy, reviewedAt, reviewNote, updatedAt } = report;
    await this.db
      .insert(dailyReports)
      .values(report)
      .onConflictDoUpdate({ target: dailyReports.id, set: { status, sections, photoUrls, submittedAt, reviewedBy, reviewedAt, reviewNote, updatedAt } });
  }

  comments(reportId: string): Promise<ReportComment[]> {
    return this.db.select().from(reportComments).where(eq(reportComments.reportId, reportId)).orderBy(asc(reportComments.at));
  }

  async addComment(comment: ReportComment): Promise<void> {
    await this.db.insert(reportComments).values(comment);
  }
}
