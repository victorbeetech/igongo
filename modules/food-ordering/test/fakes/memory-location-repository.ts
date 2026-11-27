/**
 * An in-memory saved-pin store for tests. It keys every row by the owner's
 * user ID, just as the real table does.
 */

import type { LocationRepository } from "../../src/application/ports/location-repository";
import type { SavedLocation } from "../../src/domain/saved-location";

export class MemoryLocationRepository implements LocationRepository {
  /** Pins by owner user ID. */
  readonly rows = new Map<string, SavedLocation>();

  /** The pin of [userId], or null. */
  async read(userId: string): Promise<SavedLocation | null> {
    return this.rows.get(userId) ?? null;
  }

  /** Replaces the pin of [userId]. */
  async write(userId: string, location: SavedLocation): Promise<void> {
    this.rows.set(userId, location);
  }

  /** Removes the pin of [userId]. */
  async clear(userId: string): Promise<void> {
    this.rows.delete(userId);
  }
}
