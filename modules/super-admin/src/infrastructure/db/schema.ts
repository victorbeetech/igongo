/**
 * The Super Admin Console's own Postgres schema, `super_admin`. No other
 * module reads it; they ask through the `ModuleSwitchReader` and
 * `SecretReader` contracts.
 */

import { boolean, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

/** The `super_admin` schema. */
export const superAdminSchema = pgSchema("super_admin");

/** A module's switch. Modules with no row are on. */
export const moduleSwitches = superAdminSchema.table("module_switches", {
  moduleKey: text("module_key").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  /** Maintenance mode: on but closed, with a message for users. */
  maintenance: boolean("maintenance").notNull().default(false),
  message: text("message"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

/** One settings section (hotel profile, branding, regional) as JSON. */
export const settings = superAdminSchema.table("settings", {
  section: text("section").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

/**
 * Integration and gateway keys, encrypted with AES-256-GCM. The master key
 * is a Worker secret, so this table alone reveals nothing. Only the last
 * four characters are kept in the clear, to show which key is set.
 */
export const secrets = superAdminSchema.table("secrets", {
  key: text("key").primaryKey(),
  sealed: text("sealed").notNull(),
  lastFour: text("last_four").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by"),
});
