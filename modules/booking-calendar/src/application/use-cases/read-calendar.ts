/**
 * Use case: the guest-facing calendar for a run of days. For each day it
 * asks the booking engine how many rooms or slots are left (live bookings
 * against capacity), then applies the day rule. Steps:
 *   1. stop if the calendar is switched off;
 *   2. for each day, list the rooms sold that day (guests see only rooms
 *      marked visible to clients);
 *   3. for each room, get the units left (reusing the booking engine's rule);
 *   4. decide the day's status and return only availability: never a guest name.
 */

import { hotelDate, type ChangeContext } from "@igongo/core";
import { unitsLeft, type BookingsDeps, type Offering } from "@igongo/bookings-kit";
import { addDays, dateRange } from "../../domain/calendar-dates";
import { dayStatus, type DayStatus } from "../../domain/day-status";
import type { CalendarSettingsStore } from "../ports/calendar-settings-store";

/** One room or slot on a day, as guests may see it. */
export interface CalendarRoom {
  offeringId: string;
  name: string;
  /** Units left, or null when there is no limit. */
  left: number | null;
}

/** One day on the calendar. */
export interface CalendarDay {
  date: string;
  status: DayStatus;
  rooms: CalendarRoom[];
}

/** The calendar as returned to guests. */
export interface CalendarView {
  enabled: boolean;
  days: CalendarDay[];
}

/** What the use case needs for one request. */
export interface CalendarDeps {
  /** The booking engine's deps for the module whose rooms the calendar shows. */
  booking: BookingsDeps;
  settings: CalendarSettingsStore;
  change: ChangeContext;
}

/** Offering kinds the calendar shows: rooms (nights) and timed slots. Enquiries and stock have no date grid. */
const CALENDAR_KINDS = ["nights", "slot"] as const;

/**
 * Units left for one offering on one day. Nights are checked for a one-night
 * stay. Slot offerings count as open while any of their slots is open, so the
 * day is full only when every slot is taken.
 */
async function unitsOnDay(booking: BookingsDeps, o: Offering, date: string): Promise<number> {
  // Nights: a one-night stay from this day, using the booking engine's rule.
  if (o.kind === "nights") return unitsLeft(booking, o, { date, endDate: addDays(date, 1) });
  // Slot offerings without fixed slots are whole-day passes.
  if (o.slots.length === 0) return unitsLeft(booking, o, { date });
  // Slot offerings with times: take the best slot left.
  const lefts = await Promise.all(o.slots.map((slot) => unitsLeft(booking, o, { date, slot })));
  return Math.max(...lefts);
}

/** Builds the calendar for [days] days from [from], inside the super admin's window. */
export async function readCalendar(d: CalendarDeps, from: string, days: number): Promise<CalendarView> {
  // 1. The super admin may have switched the calendar off everywhere.
  const settings = await d.settings.read();
  if (!settings.enabled) return { enabled: false, days: [] };

  // Keep the request inside the window the super admin set.
  const span = Math.min(days, settings.windowDays);
  const today = hotelDate(d.change.now);
  // 2. Only rooms marked visible to clients are listed for guests.
  const offerings = (await d.booking.offerings.list()).filter(
    (o) => o.active && o.visibleToClients && (CALENDAR_KINDS as readonly string[]).includes(o.kind),
  );

  const result: CalendarDay[] = [];
  for (const date of dateRange(from, span)) {
    // Past days are closed, so skip the stock checks for them.
    if (date < today) {
      result.push({ date, status: "closed", rooms: [] });
      continue;
    }
    const rooms: CalendarRoom[] = [];
    const lefts: number[] = [];
    for (const o of offerings) {
      // A fixed-date offering (such as an event) is only on its own day.
      if (o.onDate && o.onDate !== date) continue;
      // 3. Ask the booking engine how many units are left on this day.
      const left = await unitsOnDay(d.booking, o, date);
      rooms.push({ offeringId: o.id, name: o.name, left: Number.isFinite(left) ? left : null });
      lefts.push(left);
    }
    // 4. Apply the day rule and keep only availability.
    const status = dayStatus({ date, today, openWeekdays: settings.openWeekdays, left: lefts, fullRule: settings.fullRule });
    result.push({ date, status, rooms });
  }
  return { enabled: true, days: result };
}
