/**
 * Port: where guests' saved dishes are kept. Every method takes the owner's
 * user ID, so one guest's list can never be read or changed through another
 * guest's session.
 */

import type { SavedDishRow } from "../../domain/saved-dish";

export interface SavedDishRepository {
  /** The dishes [userId] saved, newest first. */
  list(userId: string): Promise<SavedDishRow[]>;
  /** Saves [row] for its owner (saving the same dish again keeps one row). */
  save(row: SavedDishRow): Promise<void>;
  /** Removes dish [itemId] from the list of [userId]. */
  remove(userId: string, itemId: string): Promise<void>;
}
