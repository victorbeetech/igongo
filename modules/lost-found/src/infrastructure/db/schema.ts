/**
 * Lost and found's own Postgres schema, `lost_found`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const lostFoundSchema = pgSchema("lost_found");

export const { records, events, settings } = recordTables(lostFoundSchema);

/** The tables together, for the kit's repository. */
export const lostFoundTables = { records, events, settings };
