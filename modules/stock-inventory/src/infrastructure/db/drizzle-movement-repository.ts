/** `MovementRepository` on stock's `movements` ledger; balances are summed from it. */

import { nextRunningNumber, type Database } from "@igongo/core";
import { and, desc, eq, gte, isNotNull, lt, or, sum } from "drizzle-orm";
import type { Balance, MovementFilter, MovementRepository } from "../../application/ports/movement-repository";
import type { Movement } from "../../domain/movement";
import { roundQty } from "../../domain/stock-math";
import { movements as m } from "./schema";

export class DrizzleMovementRepository implements MovementRepository {
  constructor(private readonly db: Database) {}

  async add(movement: Movement): Promise<void> {
    await this.db.insert(m).values(movement);
  }

  nextNumber(): Promise<string> {
    return nextRunningNumber(this.db, m, m.number, "STK");
  }

  list(f: MovementFilter): Promise<Movement[]> {
    return this.db
      .select()
      .from(m)
      .where(and(f.itemId ? eq(m.itemId, f.itemId) : undefined, f.storeId ? or(eq(m.fromStoreId, f.storeId), eq(m.toStoreId, f.storeId)) : undefined, f.kind ? eq(m.kind, f.kind) : undefined, f.from ? gte(m.at, f.from) : undefined, f.to ? lt(m.at, f.to) : undefined))
      .orderBy(desc(m.at))
      .limit(f.limit);
  }

  async balances(f: { itemId?: string; storeId?: string }): Promise<Balance[]> {
    // Step 1: what came into each store, and what left it, per item.
    const item = f.itemId ? eq(m.itemId, f.itemId) : undefined;
    const [ins, outs] = await Promise.all([
      this.db.select({ itemId: m.itemId, storeId: m.toStoreId, qty: sum(m.qty) }).from(m).where(and(isNotNull(m.toStoreId), item, f.storeId ? eq(m.toStoreId, f.storeId) : undefined)).groupBy(m.itemId, m.toStoreId),
      this.db.select({ itemId: m.itemId, storeId: m.fromStoreId, qty: sum(m.qty) }).from(m).where(and(isNotNull(m.fromStoreId), item, f.storeId ? eq(m.fromStoreId, f.storeId) : undefined)).groupBy(m.itemId, m.fromStoreId),
    ]);
    // Step 2: in minus out, per item and store.
    const totals = new Map<string, Balance>();
    const add = (itemId: string, storeId: string, qty: number) => {
      const key = `${itemId}|${storeId}`;
      const b = totals.get(key) ?? { itemId, storeId, qty: 0 };
      totals.set(key, { ...b, qty: roundQty(b.qty + qty) });
    };
    for (const r of ins) add(r.itemId, r.storeId as string, Number(r.qty ?? 0));
    for (const r of outs) add(r.itemId, r.storeId as string, -Number(r.qty ?? 0));
    return [...totals.values()].filter((b) => b.qty !== 0);
  }
}
