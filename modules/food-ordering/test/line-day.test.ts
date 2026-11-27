// Tests the hotel's day rules for cart lines.
import { describe, expect, it } from "vitest";
import { checkLineDay, hotelDayKey } from "../src/domain/line-day";

describe("hotelDayKey", () => {
  it("takes the day in Uganda time, so 23:30 UTC is already the next day", () => {
    expect(hotelDayKey(new Date("2026-11-27T21:30:00Z"))).toBe("2026-11-28");
    expect(hotelDayKey(new Date("2026-11-27T20:59:00Z"))).toBe("2026-11-27");
  });
});

describe("checkLineDay", () => {
  const now = new Date("2026-11-27T10:00:00Z");
  it("accepts today and a later day", () => {
    expect(() => checkLineDay("2026-11-27", now)).not.toThrow();
    expect(() => checkLineDay("2026-12-20", now)).not.toThrow();
  });
  it("rejects a past day", () => {
    expect(() => checkLineDay("2026-11-26", now)).toThrow(/today or a later day/);
  });
  it("rejects a day more than 60 days ahead", () => {
    expect(() => checkLineDay("2027-02-01", now)).toThrow(/60 days/);
    expect(() => checkLineDay("2027-01-26", now)).not.toThrow();
  });
});
