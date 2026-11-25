/**
 * The Notice Board's own Postgres schema, `notices`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { boolean, index, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const noticesSchema = pgSchema("notices");

/** Posts, kept for ever (removed ones are marked, not deleted). */
export const notices = noticesSchema.table(
  "notices",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    authorId: text("author_id").notNull(),
    authorName: text("author_name").notNull(),
    /** Role keys; empty means every staff member. */
    audienceRoles: text("audience_roles").array().notNull(),
    pinned: boolean("pinned").notNull().default(false),
    allowComments: boolean("allow_comments").notNull().default(true),
    allowLikes: boolean("allow_likes").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    removedAt: timestamp("removed_at", { withTimezone: true }),
  },
  (t) => [index("notices_board_idx").on(t.pinned, t.createdAt)],
);

/** One like per person per post. */
export const noticeLikes = noticesSchema.table(
  "notice_likes",
  {
    noticeId: text("notice_id")
      .notNull()
      .references(() => notices.id),
    userId: text("user_id").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.noticeId, t.userId] })],
);

/** Comments under posts. */
export const noticeComments = noticesSchema.table(
  "notice_comments",
  {
    id: text("id").primaryKey(),
    noticeId: text("notice_id")
      .notNull()
      .references(() => notices.id),
    authorId: text("author_id").notNull(),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("notice_comments_notice_idx").on(t.noticeId, t.at)],
);

/** Read receipts: the first time each person opened each post. */
export const noticeReads = noticesSchema.table(
  "notice_reads",
  {
    noticeId: text("notice_id")
      .notNull()
      .references(() => notices.id),
    userId: text("user_id").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.noticeId, t.userId] })],
);

/** The board-wide switches (key `board`). */
export const settings = moduleSettingsTable(noticesSchema);
