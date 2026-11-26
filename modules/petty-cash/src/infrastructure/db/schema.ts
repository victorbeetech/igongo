/**
 * Petty cash's own Postgres schema, `petty_cash`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const pettyCashSchema = pgSchema("petty_cash");

export const { records, events, settings } = recordTables(pettyCashSchema);

/** The tables together, for the kit's repository. */
export const pettyCashTables = { records, events, settings };
