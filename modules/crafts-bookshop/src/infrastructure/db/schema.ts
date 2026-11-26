/**
 * Crafts & Bookshop's own Postgres schema, `shop`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const craftsBookshopSchema = pgSchema("shop");

export const { offerings, bookings, settings } = bookingTables(craftsBookshopSchema);

/** The tables together, for the kit's repositories. */
export const craftsBookshopTables = { offerings, bookings, settings };
