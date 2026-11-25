/** `PinStore` on Postgres. */

import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { PinStore, StoredPin } from "../../application/ports/pin-store";
import { pins } from "./schema";

export class DrizzlePinStore implements PinStore {
  constructor(private readonly db: Database) {}

  async get(userId: string, deviceId: string): Promise<StoredPin | null> {
    const [row] = await this.db.select().from(pins).where(this.key(userId, deviceId));
    return row ?? null;
  }

  async save(userId: string, deviceId: string, pinHash: string): Promise<void> {
    const reset = { pinHash, failedCount: 0, lockedUntil: null };
    await this.db.insert(pins).values({ userId, deviceId, ...reset }).onConflictDoUpdate({ target: [pins.userId, pins.deviceId], set: reset });
  }

  async recordFailure(userId: string, deviceId: string, lockUntil: Date | null): Promise<void> {
    await this.db.update(pins).set({ failedCount: sql`${pins.failedCount} + 1`, lockedUntil: lockUntil }).where(this.key(userId, deviceId));
  }

  async clearFailures(userId: string, deviceId: string): Promise<void> {
    await this.db.update(pins).set({ failedCount: 0, lockedUntil: null }).where(this.key(userId, deviceId));
  }

  private key(userId: string, deviceId: string) {
    return and(eq(pins.userId, userId), eq(pins.deviceId, deviceId));
  }
}
