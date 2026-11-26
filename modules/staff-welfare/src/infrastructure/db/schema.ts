/**
 * Staff requests and welfare's own Postgres schema, `welfare`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const staffWelfareSchema = pgSchema("welfare");

export const { records, events, settings } = recordTables(staffWelfareSchema);

/** The tables together, for the kit's repository. */
export const staffWelfareTables = { records, events, settings };
