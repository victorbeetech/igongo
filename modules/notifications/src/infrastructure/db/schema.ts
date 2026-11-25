/**
 * This module's own Postgres schema, `notifications`. No other module reads
 * these tables (code standards, rule 2). Change this file, then run
 * `pnpm db:generate` to write the next SQL migration in ../../../migrations.
 */

import { index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

/** The `notifications` schema. */
export const notificationsSchema = pgSchema("notifications");

/** Android, iOS or web, as a Postgres enum. */
export const devicePlatform = notificationsSchema.enum("device_platform", ["android", "ios", "web"]);

/**
 * One row per app install that can receive pushes.
 * The token is the key: one install has one token, and if another person
 * signs in on the same phone the row moves to them.
 */
export const deviceTokens = notificationsSchema.table(
  "device_tokens",
  {
    /** The FCM registration token. */
    token: text("token").primaryKey(),
    /** The person signed in on the phone (an ID from Users & Login). */
    userId: text("user_id").notNull(),
    /** Android, iOS or web. */
    platform: devicePlatform("platform").notNull(),
    /** When the token was first saved. */
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    /** When the phone last registered it, to clean up old tokens. */
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // Sending looks tokens up by person.
  (table) => [index("device_tokens_user_id_idx").on(table.userId)],
);
