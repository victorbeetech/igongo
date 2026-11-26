/**
 * Pool's own Postgres schema, `pool`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const poolSchema = pgSchema("pool");

export const { offerings, bookings, settings } = bookingTables(poolSchema);

/** The tables together, for the kit's repositories. */
export const poolTables = { offerings, bookings, settings };
