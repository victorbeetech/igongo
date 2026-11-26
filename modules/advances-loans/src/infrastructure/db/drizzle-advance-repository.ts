/** `AdvanceRepository` on Postgres, with Drizzle. */

import { nextRunningNumber, omitKeys, type Database } from "@igongo/core";
import { and, asc, desc, eq, isNotNull, lte, sql, type SQL } from "drizzle-orm";
import type { AdvanceRepository } from "../../application/ports/advance-repository";
import type { Advance, AdvanceKind, AdvanceStatus } from "../../domain/advance";
import type { Repayment } from "../../domain/repayment";
import { advances, repayments } from "./schema";

/** A row as a domain advance. */
const toAdvance = (r: typeof advances.$inferSelect): Advance => ({ ...r, kind: r.kind as AdvanceKind, status: r.status as AdvanceStatus });

export class DrizzleAdvanceRepository implements AdvanceRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<Advance | null> {
    const [row] = await this.db.select().from(advances).where(eq(advances.id, id));
    return row ? toAdvance(row) : null;
  }

  async list(filter: { staffId?: string; department?: string; status?: AdvanceStatus; limit: number }): Promise<Advance[]> {
    const where: SQL[] = [];
    if (filter.staffId) where.push(eq(advances.staffId, filter.staffId));
    if (filter.department) where.push(eq(advances.department, filter.department));
    if (filter.status) where.push(eq(advances.status, filter.status));
    return (await this.db.select().from(advances).where(and(...where)).orderBy(desc(advances.requestedAt)).limit(filter.limit)).map(toAdvance);
  }

  nextNumber(): Promise<string> {
    return nextRunningNumber(this.db, advances, advances.number, "ADV");
  }

  async save(a: Advance): Promise<void> {
    // Everything but the ID, number and request time may change.
    await this.db.insert(advances).values(a).onConflictDoUpdate({ target: advances.id, set: omitKeys(a, "id", "number", "requestedAt") });
  }

  async addRepayment(r: Repayment): Promise<boolean> {
    const added = await this.db.insert(repayments).values(r).onConflictDoNothing().returning({ id: repayments.id });
    return added.length > 0;
  }

  repayments(advanceId: string): Promise<Repayment[]> {
    return this.db.select().from(repayments).where(eq(repayments.advanceId, advanceId)).orderBy(asc(repayments.at));
  }

  async repaying(period: string): Promise<Advance[]> {
    const rows = await this.db
      .select()
      .from(advances)
      .where(and(eq(advances.status, "disbursed"), lte(advances.startPeriod, period), sql`${advances.repaid} < ${advances.amount}`));
    return rows.map(toAdvance);
  }

  async hasRepayment(advanceId: string, period: string): Promise<boolean> {
    const [row] = await this.db.select({ id: repayments.id }).from(repayments).where(and(eq(repayments.advanceId, advanceId), eq(repayments.period, period), isNotNull(repayments.payRunId))).limit(1);
    return !!row;
  }
}
