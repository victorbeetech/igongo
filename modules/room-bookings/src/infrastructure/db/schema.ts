/**
 * Room Bookings's own Postgres schema, `rooms`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const roomBookingsSchema = pgSchema("rooms");

export const { offerings, bookings, settings } = bookingTables(roomBookingsSchema);

/** The tables together, for the kit's repositories. */
export const roomBookingsTables = { offerings, bookings, settings };
