/**
 * Feedback and complaints's own Postgres schema, `feedback`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const guestFeedbackSchema = pgSchema("feedback");

export const { records, events, settings } = recordTables(guestFeedbackSchema);

/** The tables together, for the kit's repository. */
export const guestFeedbackTables = { records, events, settings };
