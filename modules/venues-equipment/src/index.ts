/**
 * Venues and equipment (module 70) of the Igongo API. The gateway imports only this
 * file. See modules/venues-equipment/README.md.
 */

import { bookingKpis, bookingsDeps, bookingsRouter, type BookingsDeps } from "@igongo/bookings-kit";
import type { ChangeContext, Database } from "@igongo/core";
import { venuesEquipmentModule } from "./domain/venues-equipment-module";
import { venuesEquipmentTables } from "./infrastructure/db/schema";

export { venuesEquipmentModule };

/** This module's dependencies for one request. */
export const venuesEquipmentDeps = (db: Database, change: ChangeContext): BookingsDeps => bookingsDeps(venuesEquipmentModule, venuesEquipmentTables, db, change);

/** The routes, mounted at `/api/venues`. */
export const venuesEquipmentRouter = (deps: Parameters<typeof bookingsRouter>[1]) => bookingsRouter(venuesEquipmentModule.key, deps);


/** This module's numbers for the management dashboard. */
export const venuesEquipmentKpis = (db: Database) => bookingKpis(venuesEquipmentModule, venuesEquipmentTables, db, "Venues and equipment");
