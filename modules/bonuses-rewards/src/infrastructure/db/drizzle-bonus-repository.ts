/** `BonusRepository` on Postgres, with Drizzle. */

import { omitKeys, type Database } from "@igongo/core";
import { and, asc, desc, eq, lt, sql, type SQL } from "drizzle-orm";
import type { BonusRepository } from "../../application/ports/bonus-repository";
import type { Bonus, BonusKind, BonusStatus } from "../../domain/bonus";
import type { BuffetUse } from "../../domain/buffet-use";
import { bonuses, buffetUses } from "./schema";

/** A row as a domain bonus. */
const toBonus = (r: typeof bonuses.$inferSelect): Bonus => ({ ...r, kind: r.kind as BonusKind, status: r.status as BonusStatus });

export class DrizzleBonusRepository implements BonusRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<Bonus | null> {
    const [row] = await this.db.select().from(bonuses).where(eq(bonuses.id, id));
    return row ? toBonus(row) : null;
  }

  async list(filter: { staffId?: string; department?: string; status?: BonusStatus; kind?: BonusKind; limit: number }): Promise<Bonus[]> {
    const where: SQL[] = [];
    if (filter.staffId) where.push(eq(bonuses.staffId, filter.staffId));
    if (filter.department) where.push(eq(bonuses.department, filter.department));
    if (filter.status) where.push(eq(bonuses.status, filter.status));
    if (filter.kind) where.push(eq(bonuses.kind, filter.kind));
    return (await this.db.select().from(bonuses).where(and(...where)).orderBy(desc(bonuses.createdAt)).limit(filter.limit)).map(toBonus);
  }

  async save(b: Bonus): Promise<void> {
    await this.db.insert(bonuses).values(b).onConflictDoUpdate({ target: bonuses.id, set: omitKeys(b, "id", "createdAt") });
  }

  async usePass(use: BuffetUse): Promise<boolean> {
    // Raise the count only while a pass is left, so two stations cannot use the last one twice.
    const taken = await this.db
      .update(bonuses)
      .set({ passesUsed: sql`${bonuses.passesUsed} + 1`, status: sql`case when ${bonuses.passesUsed} + 1 >= ${bonuses.passes} then 'used' else ${bonuses.status} end` })
      .where(and(eq(bonuses.id, use.bonusId), lt(bonuses.passesUsed, bonuses.passes)))
      .returning({ id: bonuses.id });
    if (!taken.length) return false;
    await this.db.insert(buffetUses).values(use);
    return true;
  }

  async usedOn(staffId: string, workDate: string): Promise<boolean> {
    const [row] = await this.db.select({ id: buffetUses.id }).from(buffetUses).where(and(eq(buffetUses.staffId, staffId), eq(buffetUses.workDate, workDate))).limit(1);
    return !!row;
  }

  uses(bonusId: string): Promise<BuffetUse[]> {
    return this.db.select().from(buffetUses).where(eq(buffetUses.bonusId, bonusId)).orderBy(asc(buffetUses.at));
  }
}
