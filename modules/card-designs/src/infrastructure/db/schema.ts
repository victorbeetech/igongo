/**
 * Card designs' own Postgres schema, `card_designs`. No other module reads
 * it. The whole design set is one settings row (key `designs`).
 * Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { pgSchema } from "drizzle-orm/pg-core";

export const cardDesignsSchema = pgSchema("card_designs");

/** The design set. */
export const settings = moduleSettingsTable(cardDesignsSchema);
