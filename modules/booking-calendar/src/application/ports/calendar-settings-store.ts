/** Where the calendar's settings are kept. Implemented in infrastructure. */

import type { CalendarSettings } from "../../domain/calendar-settings";

export interface CalendarSettingsStore {
  /** The saved settings, with defaults for anything not saved yet. */
  read(): Promise<CalendarSettings>;
  /** Saves [settings], recording who changed them and when. */
  write(settings: CalendarSettings, by: string | null, now: Date): Promise<void>;
}
