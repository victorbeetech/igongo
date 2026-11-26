/**
 * Events & Conferences (module 69) of the Igongo API. The gateway imports only this
 * file. See modules/events-conferences/README.md.
 */

import { bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { eventsConferencesModule } from "./domain/events-conferences-module";
import { eventsConferencesTables } from "./infrastructure/db/schema";

export { eventsConferencesModule };

/** This module's dependencies for one request. */
export const eventsConferencesDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(eventsConferencesModule, eventsConferencesTables, db, change);

/** The routes, mounted at `/api/events`. */
export const eventsConferencesRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(eventsConferencesModule.key, deps);

