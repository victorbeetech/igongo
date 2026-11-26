/**
 * CRM's own Postgres schema, `crm`. No other module reads these tables.
 * Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, jsonb, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { MarketingConsent } from "../../domain/marketing-consent";

export const crmSchema = pgSchema("crm");

/** One row per guest or client. */
export const profiles = crmSchema.table(
  "profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    nationality: text("nationality"),
    birthday: text("birthday"),
    preferences: text("preferences"),
    allergies: text("allergies"),
    tags: jsonb("tags").$type<string[]>().notNull(),
    consent: jsonb("consent").$type<MarketingConsent>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  // One profile per account; search by name and phone.
  (t) => [uniqueIndex("profiles_user_key").on(t.userId), index("profiles_name_idx").on(t.name), index("profiles_phone_idx").on(t.phone)],
);

/** Staff notes, kept for ever. */
export const staffNotes = crmSchema.table(
  "staff_notes",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id").notNull(),
    text: text("text").notNull(),
    byUserId: text("by_user_id"),
    byName: text("by_name"),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("staff_notes_profile_idx").on(t.profileId)],
);

/** The CRM options (key `crm`). */
export const settings = moduleSettingsTable(crmSchema);
