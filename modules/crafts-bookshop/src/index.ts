/**
 * Crafts & Bookshop (module 73) of the Igongo API. The gateway imports only this
 * file. See modules/crafts-bookshop/README.md.
 */

import { bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { craftsBookshopModule } from "./domain/crafts-bookshop-module";
import { craftsBookshopTables } from "./infrastructure/db/schema";

export { craftsBookshopModule };

/** This module's dependencies for one request. */
export const craftsBookshopDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(craftsBookshopModule, craftsBookshopTables, db, change);

/** The routes, mounted at `/api/shop`. */
export const craftsBookshopRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(craftsBookshopModule.key, deps);

