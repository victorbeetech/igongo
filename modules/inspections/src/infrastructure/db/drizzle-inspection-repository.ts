/** `InspectionRepository` on Postgres, with Drizzle. */

import { countByKey, type Database } from "@igongo/core";
import { and, asc, count, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import type { InspectionRepository, RunFilter } from "../../application/ports/inspection-repository";
import type { Checklist, Frequency } from "../../domain/checklist";
import type { InspectionRun } from "../../domain/inspection-run";
import type { RunComment } from "../../domain/run-comment";
import { checklists, runComments, runLikes, runs } from "./schema";

/** A checklist row as a domain checklist. */
const toChecklist = (r: typeof checklists.$inferSelect): Checklist => ({ ...r, frequency: r.frequency as Frequency });

export class DrizzleInspectionRepository implements InspectionRepository {
  constructor(private readonly db: Database) {}

  async checklist(id: string): Promise<Checklist | null> {
    const [row] = await this.db.select().from(checklists).where(eq(checklists.id, id));
    return row ? toChecklist(row) : null;
  }

  async checklists(filter: { department?: string; activeOnly?: boolean }): Promise<Checklist[]> {
    const where: SQL[] = [];
    if (filter.department) where.push(eq(checklists.department, filter.department));
    if (filter.activeOnly) where.push(eq(checklists.active, true));
    return (await this.db.select().from(checklists).where(and(...where)).orderBy(asc(checklists.department), asc(checklists.name))).map(toChecklist);
  }

  async saveChecklist(c: Checklist): Promise<void> {
    const { name, department, frequency, dueBy, items, active, updatedAt } = c;
    await this.db.insert(checklists).values(c).onConflictDoUpdate({ target: checklists.id, set: { name, department, frequency, dueBy, items, active, updatedAt } });
  }

  async run(id: string): Promise<InspectionRun | null> {
    const [row] = await this.db.select().from(runs).where(eq(runs.id, id));
    return row ?? null;
  }

  async runs(filter: RunFilter, viewerId: string) {
    const where: SQL[] = [];
    if (filter.department) where.push(eq(runs.department, filter.department));
    if (filter.inspectorUserId) where.push(eq(runs.inspectorUserId, filter.inspectorUserId));
    if (filter.checklistId) where.push(eq(runs.checklistId, filter.checklistId));
    if (filter.from) where.push(gte(runs.workDate, filter.from));
    if (filter.to) where.push(lte(runs.workDate, filter.to));
    const rows = await this.db.select().from(runs).where(and(...where)).orderBy(desc(runs.submittedAt)).limit(filter.limit);
    // The counts for the listed runs, in grouped queries.
    const ids = rows.map((r) => r.id);
    const [likes, comments, mine] = await Promise.all([
      countByKey(this.db, runLikes, runLikes.runId, ids),
      countByKey(this.db, runComments, runComments.runId, ids),
      countByKey(this.db, runLikes, runLikes.runId, ids, eq(runLikes.userId, viewerId)),
    ]);
    return rows.map((r) => ({ ...r, likes: likes.get(r.id) ?? 0, comments: comments.get(r.id) ?? 0, likedByMe: mine.has(r.id) }));
  }

  async addRun(run: InspectionRun): Promise<void> {
    await this.db.insert(runs).values(run);
  }

  async latestRun(checklistId: string, sinceDate: string): Promise<InspectionRun | null> {
    const [row] = await this.db.select().from(runs).where(and(eq(runs.checklistId, checklistId), gte(runs.workDate, sinceDate))).orderBy(desc(runs.submittedAt)).limit(1);
    return row ?? null;
  }

  async toggleLike(runId: string, userId: string, now: Date): Promise<boolean> {
    // Try to remove; if nothing was there, add.
    const removed = await this.db.delete(runLikes).where(and(eq(runLikes.runId, runId), eq(runLikes.userId, userId))).returning({ u: runLikes.userId });
    if (removed.length) return false;
    await this.db.insert(runLikes).values({ runId, userId, at: now });
    return true;
  }

  async likeCount(runId: string): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(runLikes).where(eq(runLikes.runId, runId));
    return Number(row?.n ?? 0);
  }

  async addComment(comment: RunComment): Promise<void> {
    await this.db.insert(runComments).values(comment);
  }

  comments(runId: string): Promise<RunComment[]> {
    return this.db.select().from(runComments).where(eq(runComments.runId, runId)).orderBy(asc(runComments.at));
  }
}
