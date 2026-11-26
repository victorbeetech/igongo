/**
 * Access zones's own Postgres schema, `zones`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const accessZonesSchema = pgSchema("zones");

export const { records, events, settings } = recordTables(accessZonesSchema);

/** The tables together, for the kit's repository. */
export const accessZonesTables = { records, events, settings };
