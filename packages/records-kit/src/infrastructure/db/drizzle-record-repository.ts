/** `RecordRepository` on one module's own `records` and `record_events` tables. */

import { nextRunningNumber, omitKey, type Database } from "@igongo/core";
import { and, asc, count, desc, eq, gte, ilike, isNotNull, isNull, lte, or, type SQL } from "drizzle-orm";
import type { RecordCount, RecordFilter, RecordRepository } from "../../application/ports/record-repository";
import type { RecordEvent } from "../../domain/record-event";
import type { WorkRecord } from "../../domain/work-record";
import type { RecordTables } from "./record-tables";

export class DrizzleRecordRepository implements RecordRepository {
  constructor(
    private readonly db: Database,
    private readonly t: RecordTables,
  ) {}

  async byId(id: string): Promise<WorkRecord | null> {
    const [row] = await this.db.select().from(this.t.records).where(eq(this.t.records.id, id));
    return row ?? null;
  }

  async byCode(code: string): Promise<WorkRecord | null> {
    const [row] = await this.db.select().from(this.t.records).where(eq(this.t.records.code, code.trim().toUpperCase()));
    return row ?? null;
  }

  list(f: RecordFilter): Promise<WorkRecord[]> {
    const r = this.t.records;
    // Step 1: one condition per filter given.
    const where: (SQL | undefined)[] = [
      f.type ? eq(r.type, f.type) : undefined,
      f.status ? eq(r.status, f.status) : undefined,
      f.open === true ? isNull(r.closedAt) : f.open === false ? isNotNull(r.closedAt) : undefined,
      f.involving ? or(eq(r.ownerId, f.involving.userId), eq(r.createdBy, f.involving.userId), f.involving.staffId ? eq(r.assigneeId, f.involving.staffId) : undefined) : undefined,
      f.assigneeId ? eq(r.assigneeId, f.assigneeId) : undefined,
      f.words ? or(ilike(r.title, `%${f.words}%`), ilike(r.code, `%${f.words}%`), ilike(r.ownerName, `%${f.words}%`)) : undefined,
      f.dueFrom ? gte(r.dueOn, f.dueFrom) : undefined,
      f.dueTo ? lte(r.dueOn, f.dueTo) : undefined,
    ];
    // Step 2: dated lists (calendars, rosters) read in day order; the rest newest first.
    const order = f.dueFrom || f.dueTo ? [asc(r.dueOn), desc(r.createdAt)] : [desc(r.updatedAt)];
    return this.db.select().from(r).where(and(...where)).orderBy(...order).limit(f.limit);
  }

  nextCode(prefix: string): Promise<string> {
    return nextRunningNumber(this.db, this.t.records, this.t.records.code, prefix);
  }

  async save(record: WorkRecord): Promise<void> {
    // Insert, or update everything but the ID.
    await this.db.insert(this.t.records).values(record).onConflictDoUpdate({ target: this.t.records.id, set: omitKey(record, "id") });
  }

  async addEvent(event: RecordEvent): Promise<void> {
    await this.db.insert(this.t.events).values(event);
  }

  events(recordId: string): Promise<RecordEvent[]> {
    return this.db.select().from(this.t.events).where(eq(this.t.events.recordId, recordId)).orderBy(asc(this.t.events.at));
  }

  async counts(): Promise<RecordCount[]> {
    const r = this.t.records;
    const rows = await this.db.select({ type: r.type, status: r.status, n: count() }).from(r).groupBy(r.type, r.status);
    return rows.map((x) => ({ ...x, n: Number(x.n) }));
  }
}
