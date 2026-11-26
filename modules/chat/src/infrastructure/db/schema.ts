/**
 * Chat's own Postgres schema, `chat`. No other module reads these tables.
 * Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const chatSchema = pgSchema("chat");

/** Conversations: direct, group and desk chats. */
export const conversations = chatSchema.table(
  "conversations",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull(),
    title: text("title"),
    deskKey: text("desk_key"),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    lastPreview: text("last_preview"),
  },
  (t) => [index("conversations_desk_idx").on(t.deskKey, t.lastMessageAt)],
);

/** Who is in each conversation and how far they have read. */
export const members = chatSchema.table(
  "members",
  {
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] }), index("members_user_idx").on(t.userId)],
);

/** Messages, kept for ever. */
export const messages = chatSchema.table(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    senderId: text("sender_id").notNull(),
    senderName: text("sender_name").notNull(),
    body: text("body").notNull(),
    fileIds: text("file_ids").array().notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("messages_conversation_idx").on(t.conversationId, t.at)],
);

/** The chat settings (key `settings`). */
export const settings = moduleSettingsTable(chatSchema);
