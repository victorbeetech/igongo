/**
 * Guest content's own Postgres schema, `guest_content`. It holds one settings
 * row (key `content`) with the whole document. Change this file, then run
 * `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { pgSchema } from "drizzle-orm/pg-core";

export const guestContentSchema = pgSchema("guest_content");

/** The content document, stored under the key `content`. */
export const settings = moduleSettingsTable(guestContentSchema);
