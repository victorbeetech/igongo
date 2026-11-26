/** `FailedLoginStore` on Postgres. One row per email, kept small. */

import { eq, sql } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { FailedLoginStore } from "../../application/ports/failed-login-store";
import { failedLogins } from "./schema";

export class DrizzleFailedLoginStore implements FailedLoginStore {
  constructor(private readonly db: Database) {}

  async lockedUntil(email: string): Promise<Date | null> {
    const [row] = await this.db.select({ until: failedLogins.lockedUntil }).from(failedLogins).where(eq(failedLogins.email, email));
    return row?.until ?? null;
  }

  async addFailure(email: string): Promise<number> {
    // One statement, so two wrong tries at the same moment both count.
    const [row] = await this.db
      .insert(failedLogins)
      .values({ email, count: 1 })
      .onConflictDoUpdate({ target: failedLogins.email, set: { count: sql`${failedLogins.count} + 1`, updatedAt: new Date() } })
      .returning({ count: failedLogins.count });
    return row?.count ?? 1;
  }

  async lock(email: string, until: Date): Promise<void> {
    await this.db.update(failedLogins).set({ lockedUntil: until, count: 0, updatedAt: new Date() }).where(eq(failedLogins.email, email));
  }

  async clear(email: string): Promise<void> {
    await this.db.delete(failedLogins).where(eq(failedLogins.email, email));
  }
}
