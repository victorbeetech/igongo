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

/**
 * One row per in-app notification for one person: the Alerts inbox (S00-28).
 * Written when the API tells a person about their own things (orders,
 * deliveries, chat, sign-in alerts), so the inbox matches the pushes.
 */
export const inboxItems = notificationsSchema.table(
  "inbox_items",
  {
    /** The item's ID (prefixed `ntf_`). */
    id: text("id").primaryKey(),
    /** The person the item belongs to (an ID from Users & Login). Every read and change checks it. */
    userId: text("user_id").notNull(),
    /** Short heading, such as "Order ready". */
    title: text("title").notNull(),
    /** The message itself. */
    body: text("body").notNull(),
    /** The notification channel it was sent on (one of PUSH_CHANNELS). */
    channel: text("channel").notNull(),
    /** The app screen it opens, such as `/orders/ord_1`, or null. */
    link: text("link"),
    /** When it was created. The inbox lists newest first. */
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    /** When the person opened it, or null while unread. */
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  // The inbox pages through one person's items, newest first.
  (table) => [index("inbox_items_user_created_idx").on(table.userId, table.createdAt)],
);
