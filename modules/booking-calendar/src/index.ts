/**
 * Booking Calendar of the Igongo API. Shows guests spots available by date
 * and room, and "Spots full" when everything is taken. The gateway imports
 * only this file. See modules/booking-calendar/README.md.
 */

import type { Database } from "@igongo/core";
import { bookingCalendarModule } from "./domain/booking-calendar-module";
import { bookingCalendarSchema, calendarSettings } from "./infrastructure/db/calendar-schema";
import { SettingsCalendarStore } from "./infrastructure/db/settings-calendar-store";
import { calendarRouter } from "./presentation/calendar-router";

export { bookingCalendarModule, bookingCalendarSchema, calendarRouter };
export type { CalendarDeps, CalendarView, CalendarDay, CalendarRoom } from "./application/use-cases/read-calendar";
export type { CalendarSettings } from "./domain/calendar-settings";

/** The calendar's settings store for one request. */
export const calendarSettingsStore = (db: Database) => new SettingsCalendarStore(db, calendarSettings);
