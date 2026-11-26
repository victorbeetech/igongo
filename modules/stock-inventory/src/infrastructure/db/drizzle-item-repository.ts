/** `ItemRepository` on stock's `items` table. */

import { omitKey, type Database } from "@igongo/core";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import type { ItemRepository } from "../../application/ports/item-repository";
import type { StockItem } from "../../domain/stock-item";
import { items } from "./schema";

export class DrizzleItemRepository implements ItemRepository {
  constructor(private readonly db: Database) {}

  list(f: { words?: string; category?: string; activeOnly?: boolean }): Promise<StockItem[]> {
    return this.db
      .select()
      .from(items)
      .where(and(f.words ? or(ilike(items.name, `%${f.words}%`), ilike(items.code, `%${f.words}%`)) : undefined, f.category ? eq(items.category, f.category) : undefined, f.activeOnly ? eq(items.active, true) : undefined))
      .orderBy(asc(items.category), asc(items.name))
      .limit(2000);
  }

  async byId(id: string): Promise<StockItem | null> {
    const [row] = await this.db.select().from(items).where(eq(items.id, id));
    return row ?? null;
  }

  async byCode(code: string): Promise<StockItem | null> {
    const [row] = await this.db.select().from(items).where(eq(items.code, code.trim().toUpperCase()));
    return row ?? null;
  }

  async save(item: StockItem): Promise<void> {
    await this.db.insert(items).values(item).onConflictDoUpdate({ target: items.id, set: omitKey(item, "id") });
  }
}
