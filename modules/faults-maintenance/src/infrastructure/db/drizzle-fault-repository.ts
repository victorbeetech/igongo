/** `FaultRepository` on Postgres, with Drizzle. People are kept as flat columns so lists can filter on them. */

import { nextRunningNumber, omitKeys, type Database } from "@igongo/core";
import { and, asc, count, desc, eq, notInArray, or, sql, type SQL } from "drizzle-orm";
import type { FaultFilter, FaultRepository } from "../../application/ports/fault-repository";
import type { Fault } from "../../domain/fault";
import type { FaultComment } from "../../domain/fault-comment";
import type { FaultEvent } from "../../domain/fault-event";
import type { FaultStatus } from "../../domain/fault-status";
import { faultComments, faultEvents, faultLikes, faults } from "./schema";

type Row = typeof faults.$inferSelect;

/** A row as a domain fault. */
function toFault(r: Row): Fault {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description,
    category: r.category,
    location: r.location,
    department: r.department,
    priority: r.priority as Fault["priority"],
    status: r.status as FaultStatus,
    photoIds: r.photoIds,
    reportedBy: { userId: r.reporterUserId, staffId: r.reporterStaffId, name: r.reporterName },
    assignedTo: r.assignedName ? { userId: r.assignedUserId, staffId: r.assignedStaffId, name: r.assignedName } : null,
    sourceModule: r.sourceModule,
    sourceRecordId: r.sourceRecordId,
    fixNote: r.fixNote,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    fixedAt: r.fixedAt,
    closedAt: r.closedAt,
  };
}

/** A domain fault as a row. */
function toRow(f: Fault): Row {
  return {
    id: f.id,
    number: f.number,
    title: f.title,
    description: f.description,
    category: f.category,
    location: f.location,
    department: f.department,
    priority: f.priority,
    status: f.status,
    photoIds: f.photoIds,
    reporterUserId: f.reportedBy.userId,
    reporterStaffId: f.reportedBy.staffId,
    reporterName: f.reportedBy.name,
    assignedUserId: f.assignedTo?.userId ?? null,
    assignedStaffId: f.assignedTo?.staffId ?? null,
    assignedName: f.assignedTo?.name ?? null,
    sourceModule: f.sourceModule,
    sourceRecordId: f.sourceRecordId,
    fixNote: f.fixNote,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    fixedAt: f.fixedAt,
    closedAt: f.closedAt,
  };
}

export class DrizzleFaultRepository implements FaultRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<Fault | null> {
    const [row] = await this.db.select().from(faults).where(eq(faults.id, id));
    return row ? toFault(row) : null;
  }

  async list(filter: FaultFilter, viewerId: string) {
    const where: SQL[] = [];
    if (filter.status) where.push(eq(faults.status, filter.status));
    if (filter.openOnly) where.push(notInArray(faults.status, ["fixed", "closed", "cancelled"]));
    if (filter.assignedStaffId) where.push(eq(faults.assignedStaffId, filter.assignedStaffId));
    if (filter.onlyPerson) where.push(or(eq(faults.reporterUserId, filter.onlyPerson), eq(faults.assignedUserId, filter.onlyPerson)) as SQL);
    if (filter.department !== undefined) {
      // A department scope still shows what the person reported or was given.
      const mine = filter.alsoPerson ? [eq(faults.reporterUserId, filter.alsoPerson), eq(faults.assignedUserId, filter.alsoPerson)] : [];
      where.push(or(eq(faults.department, filter.department), ...mine) as SQL);
    }
    const rows = await this.db
      .select({
        fault: faults,
        likes: sql<number>`(select count(*) from ${faultLikes} where ${faultLikes.faultId} = ${faults.id})`,
        comments: sql<number>`(select count(*) from ${faultComments} where ${faultComments.faultId} = ${faults.id})`,
        likedByMe: sql<boolean>`exists(select 1 from ${faultLikes} where ${faultLikes.faultId} = ${faults.id} and ${faultLikes.userId} = ${viewerId})`,
      })
      .from(faults)
      .where(and(...where))
      .orderBy(desc(faults.createdAt))
      .limit(filter.limit)
      .offset(filter.offset);
    return rows.map((r) => ({ ...toFault(r.fault), likes: Number(r.likes), comments: Number(r.comments), likedByMe: Boolean(r.likedByMe) }));
  }

  nextNumber(): Promise<string> {
    return nextRunningNumber(this.db, faults, faults.number, "FLT");
  }

  async save(fault: Fault): Promise<void> {
    const row = toRow(fault);
    // Everything but the ID, number and report time may change.
    await this.db.insert(faults).values(row).onConflictDoUpdate({ target: faults.id, set: omitKeys(row, "id", "number", "createdAt") });
  }

  async addEvent(event: FaultEvent): Promise<void> {
    await this.db.insert(faultEvents).values(event);
  }

  async events(faultId: string): Promise<FaultEvent[]> {
    const rows = await this.db.select().from(faultEvents).where(eq(faultEvents.faultId, faultId)).orderBy(asc(faultEvents.at));
    return rows.map((r) => ({ ...r, from: r.from as FaultStatus | null, to: r.to as FaultStatus }));
  }

  async toggleLike(faultId: string, userId: string, now: Date): Promise<boolean> {
    // Try to remove; if nothing was there, add.
    const removed = await this.db.delete(faultLikes).where(and(eq(faultLikes.faultId, faultId), eq(faultLikes.userId, userId))).returning({ u: faultLikes.userId });
    if (removed.length) return false;
    await this.db.insert(faultLikes).values({ faultId, userId, at: now });
    return true;
  }

  async likeCount(faultId: string): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(faultLikes).where(eq(faultLikes.faultId, faultId));
    return Number(row?.n ?? 0);
  }

  async addComment(comment: FaultComment): Promise<void> {
    await this.db.insert(faultComments).values(comment);
  }

  comments(faultId: string): Promise<FaultComment[]> {
    return this.db.select().from(faultComments).where(eq(faultComments.faultId, faultId)).orderBy(asc(faultComments.at));
  }

  async countByStatus(department?: string): Promise<Record<string, number>> {
    const rows = await this.db
      .select({ status: faults.status, n: count() })
      .from(faults)
      .where(department === undefined ? undefined : eq(faults.department, department))
      .groupBy(faults.status);
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.n)]));
  }
}
