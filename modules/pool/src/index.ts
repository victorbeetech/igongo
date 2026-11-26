/**
 * Pool (module 71) of the Igongo API. The gateway imports only this
 * file. See modules/pool/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { poolModule } from "./domain/pool-module";
import { poolTables } from "./infrastructure/db/schema";

export { poolModule };

/** This module's dependencies for one request. */
export const poolDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(poolModule, poolTables, db, change);

/** The routes, mounted at `/api/pool`. */
export const poolRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(poolModule.key, deps);


/** This module's numbers for the management dashboard. */
export const poolKpis = (db: Database) => bookingKpis(poolModule, poolTables, db, "Swimming pool");
