/**
 * Events & Conferences's own Postgres schema, `events`, with the booking kit's tables
 * (offerings, bookings, settings). No other module reads these tables.
 * Change the kit or this file, then run `pnpm db:generate`.
 */

import { bookingTables } from "@igongo/bookings-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const eventsConferencesSchema = pgSchema("events");

export const { offerings, bookings, settings } = bookingTables(eventsConferencesSchema);

/** The tables together, for the kit's repositories. */
export const eventsConferencesTables = { offerings, bookings, settings };
