/**
 * Spa / Humura (module 72) of the Igongo API. The gateway imports only this
 * file. See modules/spa/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { spaModule } from "./domain/spa-module";
import { spaTables } from "./infrastructure/db/schema";

export { spaModule };

/** This module's dependencies for one request. */
export const spaDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(spaModule, spaTables, db, change);

/** The routes, mounted at `/api/spa`. */
export const spaRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(spaModule.key, deps);


/** This module's numbers for the management dashboard. */
export const spaKpis = (db: Database) => bookingKpis(spaModule, spaTables, db, "Spa / Humura");
