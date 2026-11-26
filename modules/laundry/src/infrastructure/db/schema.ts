/**
 * Laundry's own Postgres schema, `laundry`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const laundrySchema = pgSchema("laundry");

export const { records, events, settings } = recordTables(laundrySchema);

/** The tables together, for the kit's repository. */
export const laundryTables = { records, events, settings };
