/** `ItemRepository` on Postgres, with Drizzle. */

import { omitKey, type Database } from "@igongo/core";
import { asc, eq, inArray } from "drizzle-orm";
import type { ItemRepository } from "../../application/ports/item-repository";
import type { MenuItem } from "../../domain/menu-item";
import { items } from "./schema";

export class DrizzleItemRepository implements ItemRepository {
  constructor(private readonly db: Database) {}

  async byId(id: string): Promise<MenuItem | null> {
    const [row] = await this.db.select().from(items).where(eq(items.id, id));
    return row ?? null;
  }

  byIds(ids: string[]): Promise<MenuItem[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.db.select().from(items).where(inArray(items.id, ids));
  }

  list(filter: { outlet?: string }): Promise<MenuItem[]> {
    return this.db
      .select()
      .from(items)
      .where(filter.outlet ? eq(items.outlet, filter.outlet) : undefined)
      .orderBy(asc(items.outlet), asc(items.section), asc(items.sortOrder), asc(items.name));
  }

  async save(item: MenuItem): Promise<void> {
    await this.db.insert(items).values(item).onConflictDoUpdate({ target: items.id, set: omitKey(item, "id") });
  }
}
