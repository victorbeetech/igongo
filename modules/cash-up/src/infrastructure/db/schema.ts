/**
 * Cash-up's own Postgres schema, `cash_up`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const cashUpSchema = pgSchema("cash_up");

export const { records, events, settings } = recordTables(cashUpSchema);

/** The tables together, for the kit's repository. */
export const cashUpTables = { records, events, settings };
