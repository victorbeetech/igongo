/**
 * An in-memory saved-dish store for tests. It keys every row by the owner's
 * user ID and the dish ID, just as the real table does.
 */

import type { SavedDishRepository } from "../../src/application/ports/saved-dish-repository";
import type { SavedDishRow } from "../../src/domain/saved-dish";

export class MemorySavedDishRepository implements SavedDishRepository {
  /** Every row, in the order they were first saved. */
  readonly rows: SavedDishRow[] = [];

  /** The dishes of [userId], newest first. */
  async list(userId: string): Promise<SavedDishRow[]> {
    return this.rows.filter((r) => r.userId === userId).sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }

  /** Saves [row]; a dish already saved by the same guest only has its time and outlet refreshed. */
  async save(row: SavedDishRow): Promise<void> {
    const i = this.rows.findIndex((r) => r.userId === row.userId && r.itemId === row.itemId);
    if (i >= 0) this.rows[i] = row;
    else this.rows.push(row);
  }

  /** Removes dish [itemId] of [userId]. */
  async remove(userId: string, itemId: string): Promise<void> {
    const i = this.rows.findIndex((r) => r.userId === userId && r.itemId === itemId);
    if (i >= 0) this.rows.splice(i, 1);
  }
}
