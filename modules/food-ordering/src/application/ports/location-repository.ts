/**
 * Port: where guests' saved delivery pins are kept. Every method takes the
 * owner's user ID, so one guest's pin can never be read or changed through
 * another guest's session.
 */

import type { SavedLocation } from "../../domain/saved-location";

export interface LocationRepository {
  /** The pin saved by [userId], or null when they have none. */
  read(userId: string): Promise<SavedLocation | null>;
  /** Replaces the pin of [userId] with [location]. */
  write(userId: string, location: SavedLocation): Promise<void>;
  /** Removes the pin of [userId]. */
  clear(userId: string): Promise<void>;
}
