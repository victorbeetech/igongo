/**
 * Saved delivery pins in Postgres (table `orders.delivery_pins`). Every
 * query filters by the owner's user ID, so a guest can only reach their own row.
 */

import { eq } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { LocationRepository } from "../../application/ports/location-repository";
import type { SavedLocation } from "../../domain/saved-location";
import { deliveryPins } from "./schema";

export class DrizzleLocationRepository implements LocationRepository {
  /** Uses the request's database connection [db]. */
  constructor(private readonly db: Database) {}

  /** The pin saved by [userId], or null. */
  async read(userId: string): Promise<SavedLocation | null> {
    // Step 1: find this guest's row only.
    const [row] = await this.db.select().from(deliveryPins).where(eq(deliveryPins.userId, userId)).limit(1);
    // Step 2: no row means no saved pin.
    if (!row) return null;
    return { label: row.label, zone: row.zone, lat: row.lat, lng: row.lng, updatedAt: row.updatedAt };
  }

  /** Saves [location] for [userId], replacing any earlier one (an upsert). */
  async write(userId: string, location: SavedLocation): Promise<void> {
    await this.db
      .insert(deliveryPins)
      .values({ userId, label: location.label, zone: location.zone, lat: location.lat, lng: location.lng, updatedAt: location.updatedAt })
      .onConflictDoUpdate({
        target: deliveryPins.userId,
        set: { label: location.label, zone: location.zone, lat: location.lat, lng: location.lng, updatedAt: location.updatedAt },
      });
  }

  /** Deletes the row of [userId]. */
  async clear(userId: string): Promise<void> {
    await this.db.delete(deliveryPins).where(eq(deliveryPins.userId, userId));
  }
}
