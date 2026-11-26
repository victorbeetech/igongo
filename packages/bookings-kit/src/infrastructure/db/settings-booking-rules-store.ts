/** `BookingRulesStore` on one module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { BookingRulesStore } from "../../application/ports/rules-store";
import { DEFAULT_BOOKING_RULES, type BookingRules } from "../../domain/booking-rules";
import type { BookingTables } from "./booking-tables";

export class SettingsBookingRulesStore implements BookingRulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database, t: BookingTables) {
    this.store = new ModuleSettings(db, t.settings);
  }

  read(): Promise<BookingRules> {
    return this.store.read("rules", DEFAULT_BOOKING_RULES);
  }

  write(rules: BookingRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", rules, by, now);
  }
}
