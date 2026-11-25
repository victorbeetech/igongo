/** `NoticeRepository` on Postgres, with Drizzle. Counts come from sub-queries in one round trip. */

import type { Database } from "@igongo/core";
import { and, asc, count, desc, eq, isNull, sql } from "drizzle-orm";
import type { NoticeRepository, NoticeViewer } from "../../application/ports/notice-repository";
import type { Notice } from "../../domain/notice";
import type { NoticeComment } from "../../domain/notice-comment";
import { noticeComments, noticeLikes, noticeReads, notices } from "./schema";

export class DrizzleNoticeRepository implements NoticeRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<Notice | null> {
    const [row] = await this.db.select().from(notices).where(eq(notices.id, id));
    return row ?? null;
  }

  async list(viewer: NoticeViewer, limit: number, offset: number) {
    // Audience: everyone (staff only) when empty, otherwise any shared role.
    const roles = sql`ARRAY[${sql.join(viewer.roleKeys.length ? viewer.roleKeys.map((r) => sql`${r}`) : [sql`''`], sql`, `)}]::text[]`;
    const audience = viewer.isStaff ? sql`(cardinality(${notices.audienceRoles}) = 0 OR ${notices.audienceRoles} && ${roles})` : sql`${notices.audienceRoles} && ${roles}`;
    const rows = await this.db
      .select({
        notice: notices,
        likes: sql<number>`(select count(*) from ${noticeLikes} where ${noticeLikes.noticeId} = ${notices.id})`,
        comments: sql<number>`(select count(*) from ${noticeComments} where ${noticeComments.noticeId} = ${notices.id})`,
        reads: sql<number>`(select count(*) from ${noticeReads} where ${noticeReads.noticeId} = ${notices.id})`,
        likedByMe: sql<boolean>`exists(select 1 from ${noticeLikes} where ${noticeLikes.noticeId} = ${notices.id} and ${noticeLikes.userId} = ${viewer.userId})`,
        readByMe: sql<boolean>`exists(select 1 from ${noticeReads} where ${noticeReads.noticeId} = ${notices.id} and ${noticeReads.userId} = ${viewer.userId})`,
      })
      .from(notices)
      .where(and(isNull(notices.removedAt), audience))
      .orderBy(desc(notices.pinned), desc(notices.createdAt))
      .limit(limit)
      .offset(offset);
    return rows.map((r) => ({ ...r.notice, likes: Number(r.likes), comments: Number(r.comments), reads: Number(r.reads), likedByMe: Boolean(r.likedByMe), readByMe: Boolean(r.readByMe) }));
  }

  async save(notice: Notice): Promise<void> {
    const { title, body, audienceRoles, pinned, allowComments, allowLikes, updatedAt, removedAt } = notice;
    await this.db
      .insert(notices)
      .values(notice)
      .onConflictDoUpdate({ target: notices.id, set: { title, body, audienceRoles, pinned, allowComments, allowLikes, updatedAt, removedAt } });
  }

  async toggleLike(noticeId: string, userId: string, now: Date): Promise<boolean> {
    // Try to remove; if nothing was there, add.
    const removed = await this.db.delete(noticeLikes).where(and(eq(noticeLikes.noticeId, noticeId), eq(noticeLikes.userId, userId))).returning({ u: noticeLikes.userId });
    if (removed.length) return false;
    await this.db.insert(noticeLikes).values({ noticeId, userId, at: now });
    return true;
  }

  async likeCount(noticeId: string): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(noticeLikes).where(eq(noticeLikes.noticeId, noticeId));
    return Number(row?.n ?? 0);
  }

  async addComment(comment: NoticeComment): Promise<void> {
    await this.db.insert(noticeComments).values(comment);
  }

  comments(noticeId: string): Promise<NoticeComment[]> {
    return this.db.select().from(noticeComments).where(eq(noticeComments.noticeId, noticeId)).orderBy(asc(noticeComments.at));
  }

  async markRead(noticeId: string, userId: string, now: Date): Promise<void> {
    await this.db.insert(noticeReads).values({ noticeId, userId, at: now }).onConflictDoNothing();
  }

  reads(noticeId: string): Promise<{ userId: string; at: Date }[]> {
    return this.db.select({ userId: noticeReads.userId, at: noticeReads.at }).from(noticeReads).where(eq(noticeReads.noticeId, noticeId)).orderBy(asc(noticeReads.at));
  }
}
