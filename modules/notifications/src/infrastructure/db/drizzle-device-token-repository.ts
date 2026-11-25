/** Device tokens in Postgres (Neon through Hyperdrive), with Drizzle. */

import { and, eq, inArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { DevicePlatform } from "@igongo/contracts/notifications";
import type { DeviceTokenRepository } from "../../application/ports/device-token-repository";
import type { DeviceToken } from "../../domain/device-token";
import { deviceTokens } from "./schema";

/** Any Drizzle Postgres database: Neon in production, PGlite in tests. */
export type NotificationsDb = PgDatabase<PgQueryResultHKT>;

/** `DeviceTokenRepository` on Postgres. */
export class DrizzleDeviceTokenRepository implements DeviceTokenRepository {
  constructor(private readonly db: NotificationsDb) {}

  async upsert(input: { token: string; userId: string; platform: DevicePlatform; now: Date }): Promise<void> {
    // Insert, or move an existing token to this person and refresh it.
    await this.db
      .insert(deviceTokens)
      .values({ token: input.token, userId: input.userId, platform: input.platform, createdAt: input.now, lastSeenAt: input.now })
      .onConflictDoUpdate({
        target: deviceTokens.token,
        set: { userId: input.userId, platform: input.platform, lastSeenAt: input.now },
      });
  }

  async removeForUser(token: string, userId: string): Promise<boolean> {
    const deleted = await this.db
      .delete(deviceTokens)
      .where(and(eq(deviceTokens.token, token), eq(deviceTokens.userId, userId)))
      .returning({ token: deviceTokens.token });
    return deleted.length > 0;
  }

  async removeMany(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    await this.db.delete(deviceTokens).where(inArray(deviceTokens.token, tokens));
  }

  async findByUsers(userIds: string[]): Promise<DeviceToken[]> {
    if (userIds.length === 0) return [];
    return this.db.select().from(deviceTokens).where(inArray(deviceTokens.userId, userIds));
  }
}
