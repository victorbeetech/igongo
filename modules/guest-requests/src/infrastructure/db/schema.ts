/**
 * Guest requests's own Postgres schema, `guest_requests`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const guestRequestsSchema = pgSchema("guest_requests");

export const { records, events, settings } = recordTables(guestRequestsSchema);

/** The tables together, for the kit's repository. */
export const guestRequestsTables = { records, events, settings };
