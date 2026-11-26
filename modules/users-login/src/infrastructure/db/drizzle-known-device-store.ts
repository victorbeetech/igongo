/** `KnownDeviceStore` on Postgres. */

import { count, eq } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { KnownDeviceStore } from "../../application/ports/known-device-store";
import { knownDevices } from "./schema";

export class DrizzleKnownDeviceStore implements KnownDeviceStore {
  constructor(private readonly db: Database) {}

  async remember(userId: string, deviceKey: string, label: string): Promise<{ isNew: boolean; knownBefore: number }> {
    const [before] = await this.db.select({ n: count() }).from(knownDevices).where(eq(knownDevices.userId, userId));
    const added = await this.db.insert(knownDevices).values({ userId, deviceKey, label }).onConflictDoNothing().returning({ key: knownDevices.deviceKey });
    return { isNew: added.length > 0, knownBefore: before?.n ?? 0 };
  }
}
