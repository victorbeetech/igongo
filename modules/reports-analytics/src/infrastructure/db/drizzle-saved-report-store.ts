/** `SavedReportStore` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { desc, eq, ne } from "drizzle-orm";
import type { SavedReportStore } from "../../application/ports/saved-report-store";
import type { ReportRun, ReportRunSummary, RunTrigger } from "../../domain/report-run";
import type { ReportDays, ReportSchedule, SavedReport, SavedReportInput } from "../../domain/saved-report";
import { reportRuns, savedReports } from "./schema";

/** A row as the domain's report (the text columns narrowed to their choices). */
const toReport = (r: typeof savedReports.$inferSelect): SavedReport => ({ ...r, days: r.days as ReportDays, schedule: r.schedule as ReportSchedule });

/** The run list's columns: everything but the numbers. */
const summaryColumns = {
  id: reportRuns.id,
  reportId: reportRuns.reportId,
  reportName: reportRuns.reportName,
  fromDay: reportRuns.fromDay,
  toDay: reportRuns.toDay,
  trigger: reportRuns.trigger,
  ranAt: reportRuns.ranAt,
};

export class DrizzleSavedReportStore implements SavedReportStore {
  constructor(private readonly db: Database) {}

  async list(ownerId: string | null): Promise<SavedReport[]> {
    const q = this.db.select().from(savedReports);
    const rows = await (ownerId ? q.where(eq(savedReports.ownerId, ownerId)) : q).orderBy(desc(savedReports.createdAt));
    return rows.map(toReport);
  }

  async get(id: string): Promise<SavedReport | null> {
    const [row] = await this.db.select().from(savedReports).where(eq(savedReports.id, id));
    return row ? toReport(row) : null;
  }

  async scheduled(): Promise<SavedReport[]> {
    return (await this.db.select().from(savedReports).where(ne(savedReports.schedule, "none"))).map(toReport);
  }

  async create(report: SavedReport): Promise<void> {
    await this.db.insert(savedReports).values(report);
  }

  async update(id: string, input: SavedReportInput): Promise<void> {
    await this.db.update(savedReports).set(input).where(eq(savedReports.id, id));
  }

  async remove(id: string): Promise<void> {
    await this.db.delete(savedReports).where(eq(savedReports.id, id));
  }

  async addRun(run: ReportRun): Promise<void> {
    await this.db.insert(reportRuns).values(run);
    await this.db.update(savedReports).set({ lastRunAt: run.ranAt }).where(eq(savedReports.id, run.reportId));
  }

  async runsOf(reportId: string, limit: number): Promise<ReportRunSummary[]> {
    const rows = await this.db.select(summaryColumns).from(reportRuns).where(eq(reportRuns.reportId, reportId)).orderBy(desc(reportRuns.ranAt)).limit(limit);
    return rows.map((r) => ({ ...r, trigger: r.trigger as RunTrigger }));
  }

  async getRun(id: string): Promise<ReportRun | null> {
    const [row] = await this.db.select().from(reportRuns).where(eq(reportRuns.id, id));
    return row ? { ...row, trigger: row.trigger as RunTrigger } : null;
  }
}
