/** `RiderRepository` on Postgres, with Drizzle. */

import { omitKey, type Database } from "@igongo/core";
import { asc, eq } from "drizzle-orm";
import type { RiderRepository } from "../../application/ports/rider-repository";
import type { RiderStatus } from "../../domain/rider-status";
import { riders } from "./schema";

export class DrizzleRiderRepository implements RiderRepository {
  constructor(private readonly db: Database) {}

  async byUserId(userId: string): Promise<RiderStatus | null> {
    const [row] = await this.db.select().from(riders).where(eq(riders.userId, userId));
    return row ?? null;
  }

  all(): Promise<RiderStatus[]> {
    return this.db.select().from(riders).orderBy(asc(riders.name));
  }

  async save(status: RiderStatus): Promise<void> {
    await this.db.insert(riders).values(status).onConflictDoUpdate({ target: riders.userId, set: omitKey(status, "userId") });
  }
}
