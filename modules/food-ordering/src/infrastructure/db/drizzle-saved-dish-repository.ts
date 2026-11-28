/**
 * Saved dishes in Postgres (table `orders.saved_dishes`). Every query filters
 * by the owner's user ID, so a guest can only reach their own rows.
 */

import { and, desc, eq } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { SavedDishRepository } from "../../application/ports/saved-dish-repository";
import type { SavedDishRow } from "../../domain/saved-dish";
import { savedDishes } from "./schema";

export class DrizzleSavedDishRepository implements SavedDishRepository {
  /** Uses the request's database connection [db]. */
  constructor(private readonly db: Database) {}

  /** The dishes [userId] saved, newest first. */
  async list(userId: string): Promise<SavedDishRow[]> {
    // Step 1: this guest's rows only, newest first.
    const rows = await this.db.select().from(savedDishes).where(eq(savedDishes.userId, userId)).orderBy(desc(savedDishes.savedAt));
    // Step 2: map each row to the domain shape.
    return rows.map((r) => ({ userId: r.userId, itemId: r.itemId, outlet: r.outlet, savedAt: r.savedAt }));
  }

  /** Saves [row]; saving the same dish again only refreshes its time. */
  async save(row: SavedDishRow): Promise<void> {
    await this.db
      .insert(savedDishes)
      .values({ userId: row.userId, itemId: row.itemId, outlet: row.outlet, savedAt: row.savedAt })
      .onConflictDoUpdate({ target: [savedDishes.userId, savedDishes.itemId], set: { outlet: row.outlet, savedAt: row.savedAt } });
  }

  /** Deletes dish [itemId] of [userId]. */
  async remove(userId: string, itemId: string): Promise<void> {
    await this.db.delete(savedDishes).where(and(eq(savedDishes.userId, userId), eq(savedDishes.itemId, itemId)));
  }
}
