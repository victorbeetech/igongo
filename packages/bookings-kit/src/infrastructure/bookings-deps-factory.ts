/** Builds one booking module's dependencies on its own tables. Used by each module's index. */

import type { ChangeContext, Database } from "@igongo/core";
import type { BookingModule } from "../application/booking-module";
import type { BookingsDeps } from "../application/bookings-deps";
import type { BookingTables } from "./db/booking-tables";
import { DrizzleBookingRepository } from "./db/drizzle-booking-repository";
import { DrizzleOfferingRepository } from "./db/drizzle-offering-repository";
import { SettingsBookingRulesStore } from "./db/settings-booking-rules-store";

export function bookingsDeps(module: BookingModule, tables: BookingTables, db: Database, change: ChangeContext): BookingsDeps {
  return { module, offerings: new DrizzleOfferingRepository(db, tables), bookings: new DrizzleBookingRepository(db, tables), rules: new SettingsBookingRulesStore(db, tables), change };
}
