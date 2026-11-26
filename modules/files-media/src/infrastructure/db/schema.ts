/**
 * Files & Media's own Postgres schema, `files`. No other module reads these
 * tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { bigint, index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const filesSchema = pgSchema("files");

/** Every uploaded file, kept for ever (removed ones are marked). */
export const files = filesSchema.table(
  "files",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    key: text("key").notNull(),
    purpose: text("purpose").notNull(),
    uploadedBy: text("uploaded_by").notNull(),
    uploaderName: text("uploader_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    removedAt: timestamp("removed_at", { withTimezone: true }),
  },
  (t) => [index("files_purpose_idx").on(t.purpose, t.createdAt)],
);

/** The upload limits (key `rules`). */
export const settings = moduleSettingsTable(filesSchema);
