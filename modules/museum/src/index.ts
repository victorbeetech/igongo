/**
 * Museum (module 68) of the Igongo API. The gateway imports only this
 * file. See modules/museum/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { museumModule } from "./domain/museum-module";
import { museumTables } from "./infrastructure/db/schema";

export { museumModule };

/** This module's dependencies for one request. */
export const museumDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(museumModule, museumTables, db, change);

/** The routes, mounted at `/api/museum`. */
export const museumRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(museumModule.key, deps);


/** This module's numbers for the management dashboard. */
export const museumKpis = (db: Database) => bookingKpis(museumModule, museumTables, db, "Museum");
