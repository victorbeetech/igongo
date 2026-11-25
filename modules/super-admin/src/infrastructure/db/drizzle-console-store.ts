/** `ConsoleStore` on Postgres. */

import { eq } from "drizzle-orm";
import type { ModuleState } from "@igongo/contracts/super-admin";
import type { Database } from "@igongo/core";
import type { ConsoleStore, StoredSecret } from "../../application/ports/console-store";
import { moduleSwitches, secrets, settings } from "./schema";

export class DrizzleConsoleStore implements ConsoleStore {
  constructor(private readonly db: Database) {}

  async switches(): Promise<ModuleState[]> {
    const rows = await this.db.select().from(moduleSwitches);
    return rows.map((r) => ({ moduleKey: r.moduleKey, enabled: r.enabled, maintenance: r.maintenance, message: r.message }));
  }

  async saveSwitch(s: ModuleState, by: string | null): Promise<void> {
    const set = { enabled: s.enabled, maintenance: s.maintenance, message: s.message, updatedAt: new Date(), updatedBy: by };
    await this.db.insert(moduleSwitches).values({ moduleKey: s.moduleKey, ...set }).onConflictDoUpdate({ target: moduleSwitches.moduleKey, set });
  }

  async section(name: string): Promise<unknown> {
    const [row] = await this.db.select().from(settings).where(eq(settings.section, name));
    return row?.value ?? null;
  }

  async saveSection(name: string, value: unknown, by: string | null): Promise<void> {
    const set = { value, updatedAt: new Date(), updatedBy: by };
    await this.db.insert(settings).values({ section: name, ...set }).onConflictDoUpdate({ target: settings.section, set });
  }

  secrets(): Promise<StoredSecret[]> {
    return this.db.select().from(secrets);
  }

  async secret(key: string): Promise<StoredSecret | null> {
    const [row] = await this.db.select().from(secrets).where(eq(secrets.key, key));
    return row ?? null;
  }

  async saveSecret(key: string, sealed: string, lastFour: string, by: string | null): Promise<void> {
    const set = { sealed, lastFour, updatedAt: new Date(), updatedBy: by };
    await this.db.insert(secrets).values({ key, ...set }).onConflictDoUpdate({ target: secrets.key, set });
  }

  async deleteSecret(key: string): Promise<boolean> {
    return (await this.db.delete(secrets).where(eq(secrets.key, key)).returning({ key: secrets.key })).length > 0;
  }
}
