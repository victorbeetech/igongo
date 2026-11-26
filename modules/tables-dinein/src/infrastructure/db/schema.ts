/**
 * Tables and dine-in's own Postgres schema, `tables`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const tablesDineinSchema = pgSchema("tables");

export const { offerings, bookings, settings } = bookingTables(tablesDineinSchema);

/** The tables together, for the kit's repositories. */
export const tablesDineinTables = { offerings, bookings, settings };
