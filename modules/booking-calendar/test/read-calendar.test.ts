/**
 * Tests for the guest calendar use case, with fake booking deps. Checks that
 * a fully booked day shows "Spots full", that the calendar can be switched
 * off, and that guests never receive a guest's name.
 */

import { describe, expect, it } from "vitest";
import type { BookingsDeps, Offering } from "@igongo/bookings-kit";
import { DEFAULT_CALENDAR_SETTINGS, type CalendarSettings } from "../src/domain/calendar-settings";
import { readCalendar, type CalendarDeps } from "../src/application/use-cases/read-calendar";

/** A room type that is on sale and visible to guests. */
const room = (id: string, capacity: number): Offering => ({
  id,
  kind: "nights",
  name: `Room ${id}`,
  description: null,
  price: 100,
  capacity,
  slots: [],
  onDate: null,
  photoUrl: null,
  details: {},
  active: true,
  visibleToClients: true,
  sortOrder: 0,
  updatedAt: new Date(),
});

/** Builds calendar deps where [taken] gives the units held per offering (the same for every day). */
function deps(offerings: Offering[], taken: Record<string, number>, settings: Partial<CalendarSettings> = {}): CalendarDeps {
  const booking = {
    change: { now: new Date("2026-11-28T10:00:00Z") },
    offerings: { list: async () => offerings },
    // The booking engine asks the repository how many units clash with the wanted dates.
    bookings: { unitsTaken: async (q: { offeringId: string }) => taken[q.offeringId] ?? 0 },
  } as unknown as BookingsDeps;
  return {
    booking,
    change: { now: new Date("2026-11-28T10:00:00Z") } as CalendarDeps["change"],
    settings: {
      read: async () => ({ ...DEFAULT_CALENDAR_SETTINGS, ...settings }),
      write: async () => {},
    },
  };
}

describe("readCalendar", () => {
  it("shows spots full when every room is booked", async () => {
    const view = await readCalendar(deps([room("a", 2), room("b", 1)], { a: 2, b: 1 }), "2026-11-29", 1);
    expect(view.days[0]?.status).toBe("spots_full");
  });
  it("shows open when a room is still free", async () => {
    const view = await readCalendar(deps([room("a", 2), room("b", 1)], { a: 2, b: 0 }), "2026-11-29", 1);
    expect(view.days[0]?.status).toBe("open");
  });
  it("returns nothing when the calendar is switched off", async () => {
    const view = await readCalendar(deps([room("a", 2)], {}, { enabled: false }), "2026-11-29", 3);
    expect(view).toEqual({ enabled: false, days: [] });
  });
  it("caps the days at the super admin's window, counted from today", async () => {
    // Today is 28 Nov; a 2-day window shows 28 and 29 Nov only.
    const view = await readCalendar(deps([room("a", 2)], {}, { windowDays: 2 }), "2026-11-28", 10);
    expect(view.days.map((d) => d.date)).toEqual(["2026-11-28", "2026-11-29"]);
  });
  it("shows no days past the window, even when a guest asks for later dates", async () => {
    // A guest asking from 20 Dec must not see anything beyond the 2-day window from today.
    const view = await readCalendar(deps([room("a", 2)], {}, { windowDays: 2 }), "2026-12-20", 31);
    expect(view.days).toHaveLength(0);
  });
  it("gives guests availability only: no guest name or booking detail", async () => {
    const view = await readCalendar(deps([room("a", 2)], { a: 1 }), "2026-11-29", 1);
    const text = JSON.stringify(view);
    expect(text).not.toMatch(/guestName|guestPhone|userId|notes/);
    expect(view.days[0]?.rooms[0]).toEqual({ offeringId: "a", name: "Room a", left: 1 });
  });
});
