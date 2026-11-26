/**
 * Forms's own Postgres schema, `forms`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const formsBuilderSchema = pgSchema("forms");

export const { records, events, settings } = recordTables(formsBuilderSchema);

/** The tables together, for the kit's repository. */
export const formsBuilderTables = { records, events, settings };
