/**
 * Venues and equipment's own Postgres schema, `venues`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const venuesEquipmentSchema = pgSchema("venues");

export const { offerings, bookings, settings } = bookingTables(venuesEquipmentSchema);

/** The tables together, for the kit's repositories. */
export const venuesEquipmentTables = { offerings, bookings, settings };
