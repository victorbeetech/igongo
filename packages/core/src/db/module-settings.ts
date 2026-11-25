/**
 * Module settings as data: each module that has super admin rules (meal
 * times, attendance start time, notice board switches...) keeps them in a
 * small `settings` table in its own schema, one JSON value per key. This
 * file gives every module the same table shape and the same reader, so
 * there is one way to do it.
 *
 * @example
 *   export const settings = moduleSettingsTable(attendanceSchema);
 *   const rules = new ModuleSettings(db, settings);
 *   await rules.read("rules", DEFAULT_RULES);
 */

import { eq } from "drizzle-orm";
import { jsonb, text, timestamp, type PgSchema } from "drizzle-orm/pg-core";
import type { Database } from "./database";

/** The `settings` table inside [schema]. */
export function moduleSettingsTable(schema: PgSchema) {
  return schema.table("settings", {
    key: text("key").primaryKey(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    /** Who last changed it (a user ID). */
    updatedBy: text("updated_by"),
  });
}

/** The table type [moduleSettingsTable] returns. */
export type ModuleSettingsTable = ReturnType<typeof moduleSettingsTable>;

/** Reads and writes one module's settings. */
export class ModuleSettings {
  constructor(
    private readonly db: Database,
    private readonly table: ModuleSettingsTable,
  ) {}

  /** The value under [key], with [defaults] filling any field not saved yet. */
  async read<T extends object>(key: string, defaults: T): Promise<T> {
    const [row] = await this.db.select().from(this.table).where(eq(this.table.key, key));
    return { ...defaults, ...((row?.value as Partial<T> | undefined) ?? {}) };
  }

  /** Saves [value] under [key]. */
  async write<T extends object>(key: string, value: T, by: string | null, now: Date): Promise<void> {
    await this.db
      .insert(this.table)
      .values({ key, value, updatedAt: now, updatedBy: by })
      .onConflictDoUpdate({ target: this.table.key, set: { value, updatedAt: now, updatedBy: by } });
  }
}
