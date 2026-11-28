/**
 * The booking calendar's own Postgres schema, `booking_calendar`, with one
 * settings table. No other module reads these tables. Change this file, then
 * run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { pgSchema } from "drizzle-orm/pg-core";

export const bookingCalendarSchema = pgSchema("booking_calendar");

/** Key-value settings table (the calendar's value lives under the key `calendar`). */
export const calendarSettings = moduleSettingsTable(bookingCalendarSchema);
