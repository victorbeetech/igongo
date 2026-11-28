/** Unit tests for the day rule and the date helpers (pure code, no database). */

import { describe, expect, it } from "vitest";
import { addDays, dateRange, weekdayOf } from "../src/domain/calendar-dates";
import { dayStatus, type DayFacts } from "../src/domain/day-status";

/** Facts for a Sunday 2026-11-29 with everything open, unless a test changes them. */
const base: DayFacts = { date: "2026-11-29", today: "2026-11-28", openWeekdays: [0, 1, 2, 3, 4, 5, 6], left: [2, 1], fullRule: "every_offering" };

describe("dayStatus", () => {
  it("is open when some room is left", () => {
    expect(dayStatus(base)).toBe("open");
  });
  it("is spots full when every room is taken (every_offering)", () => {
    expect(dayStatus({ ...base, left: [0, 0] })).toBe("spots_full");
  });
  it("is open when only one room is taken under every_offering", () => {
    expect(dayStatus({ ...base, left: [0, 3] })).toBe("open");
  });
  it("is spots full as soon as one room is taken under any_offering", () => {
    expect(dayStatus({ ...base, left: [0, 3], fullRule: "any_offering" })).toBe("spots_full");
  });
  it("is closed for a past day", () => {
    expect(dayStatus({ ...base, date: "2026-11-27" })).toBe("closed");
  });
  it("is closed on a weekday the hotel does not open", () => {
    expect(dayStatus({ ...base, openWeekdays: [1, 2, 3, 4, 5, 6] })).toBe("closed");
  });
  it("is closed when nothing is sold that day", () => {
    expect(dayStatus({ ...base, left: [] })).toBe("closed");
  });
  it("treats unlimited (Infinity) rooms as open", () => {
    expect(dayStatus({ ...base, left: [Infinity] })).toBe("open");
  });
});

describe("calendar dates", () => {
  it("finds the weekday in UTC (0 = Sunday)", () => {
    expect(weekdayOf("2026-11-29")).toBe(0);
    expect(weekdayOf("2026-12-05")).toBe(6);
  });
  it("adds days across a month end", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
  it("builds a run of consecutive dates", () => {
    expect(dateRange("2026-11-30", 3)).toEqual(["2026-11-30", "2026-12-01", "2026-12-02"]);
  });
});
