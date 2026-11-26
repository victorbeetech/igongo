/**
 * Data jobs's own Postgres schema, `data_jobs`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const dataImportExportSchema = pgSchema("data_jobs");

export const { records, events, settings } = recordTables(dataImportExportSchema);

/** The tables together, for the kit's repository. */
export const dataImportExportTables = { records, events, settings };
