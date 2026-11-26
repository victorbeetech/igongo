/**
 * Surveys and polls's own Postgres schema, `surveys`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const surveysPollsSchema = pgSchema("surveys");

export const { records, events, settings } = recordTables(surveysPollsSchema);

/** The tables together, for the kit's repository. */
export const surveysPollsTables = { records, events, settings };
