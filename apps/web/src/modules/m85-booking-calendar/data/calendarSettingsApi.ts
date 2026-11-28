"use client";
// Booking calendar settings for the super admin (S85-02): reads and saves the
// calendar's settings through the API's `/api/calendar/settings` routes. The
// guest calendar reads the same settings, so a save shows in the app at once.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/apiClient";
import { useApiMutation } from "@/shared/api/useApiMutation";

/** How "Spots full" is judged: every room taken (the default), or any room taken. */
export type FullRule = "every_offering" | "any_offering";

/** The calendar's settings, exactly as the API keeps them. */
export interface CalendarSettings {
  /** Whether guests see the calendar at all. */
  enabled: boolean;
  /** The weekdays the hotel takes bookings: 0 = Sunday ... 6 = Saturday. */
  openWeekdays: number[];
  /** When a day is Spots full. */
  fullRule: FullRule;
  /** How many days ahead guests can see, from 1 to 365. */
  windowDays: number;
}

/** The key the settings are cached under, so a save refreshes them. */
const SETTINGS_KEY = ["booking-calendar-settings"];

/** The saved settings, for the admin screen. */
export const useCalendarSettings = () =>
  useQuery({ queryKey: SETTINGS_KEY, queryFn: () => api<CalendarSettings>("/api/calendar/settings") });

/** Saves the whole settings set. The API checks every value before saving. */
export const useSaveCalendarSettings = () =>
  useApiMutation((settings: CalendarSettings) => api<CalendarSettings>("/api/calendar/settings", { method: "PUT", body: settings }), {
    done: "Calendar settings saved",
    refresh: [SETTINGS_KEY],
  });
