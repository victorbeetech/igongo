/**
 * Tables and dine-in (module 64) of the Igongo API. The gateway imports only this
 * file. See modules/tables-dinein/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { tablesDineinModule } from "./domain/tables-dinein-module";
import { tablesDineinTables } from "./infrastructure/db/schema";

export { tablesDineinModule };

/** This module's dependencies for one request. */
export const tablesDineinDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(tablesDineinModule, tablesDineinTables, db, change);

/** The routes, mounted at `/api/tables`. */
export const tablesDineinRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(tablesDineinModule.key, deps);


/** This module's numbers for the management dashboard. */
export const tablesDineinKpis = (db: Database) => bookingKpis(tablesDineinModule, tablesDineinTables, db, "Tables and dine-in");
