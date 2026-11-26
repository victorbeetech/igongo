/**
 * Receipts and invoices's own Postgres schema, `documents`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const receiptsInvoicingSchema = pgSchema("documents");

export const { records, events, settings } = recordTables(receiptsInvoicingSchema);

/** The tables together, for the kit's repository. */
export const receiptsInvoicingTables = { records, events, settings };
