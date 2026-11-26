/**
 * Museum's own Postgres schema, `museum`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const museumSchema = pgSchema("museum");

export const { offerings, bookings, settings } = bookingTables(museumSchema);

/** The tables together, for the kit's repositories. */
export const museumTables = { offerings, bookings, settings };
