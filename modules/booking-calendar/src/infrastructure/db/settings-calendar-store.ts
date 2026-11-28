/** `CalendarSettingsStore` on the calendar's own settings table (key `calendar`). */

import { ModuleSettings, type Database, type ModuleSettingsTable } from "@igongo/core";
import type { CalendarSettingsStore } from "../../application/ports/calendar-settings-store";
import { DEFAULT_CALENDAR_SETTINGS, type CalendarSettings } from "../../domain/calendar-settings";

export class SettingsCalendarStore implements CalendarSettingsStore {
  /** The shared settings helper from core, pointed at this module's table. */
  private readonly store: ModuleSettings;

  constructor(db: Database, table: ModuleSettingsTable) {
    this.store = new ModuleSettings(db, table);
  }

  /** Reads the saved settings, filling any missing field with its default. */
  read(): Promise<CalendarSettings> {
    return this.store.read("calendar", DEFAULT_CALENDAR_SETTINGS);
  }

  /** Writes the whole settings value under the key `calendar`. */
  write(settings: CalendarSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("calendar", settings, by, now);
  }
}
