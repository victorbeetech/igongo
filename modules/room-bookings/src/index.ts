/**
 * Room Bookings (module 67) of the Igongo API. The gateway imports only this
 * file. See modules/room-bookings/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { roomBookingsModule } from "./domain/room-bookings-module";
import { roomBookingsTables } from "./infrastructure/db/schema";

export { roomBookingsModule };

/** This module's dependencies for one request. */
export const roomBookingsDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(roomBookingsModule, roomBookingsTables, db, change);

/** The routes, mounted at `/api/rooms`. */
export const roomBookingsRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(roomBookingsModule.key, deps);


/** This module's numbers for the management dashboard. */
export const roomBookingsKpis = (db: Database) => bookingKpis(roomBookingsModule, roomBookingsTables, db, "Room bookings");
