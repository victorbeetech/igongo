/**
 * Spa / Humura's own Postgres schema, `spa`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const spaSchema = pgSchema("spa");

export const { offerings, bookings, settings } = bookingTables(spaSchema);

/** The tables together, for the kit's repositories. */
export const spaTables = { offerings, bookings, settings };
