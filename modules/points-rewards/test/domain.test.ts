/** Tests for the points maths: rounding, expiry dates, and spending oldest first. */

import { describe, expect, it } from "vitest";
import { expiryFor, pointsForSpend, valueOfPoints, DEFAULT_POINTS_RULES } from "../src/domain/rules";
import { balanceOf, spendOldestFirst, type PointsLot } from "../src/domain/points-lot";
import { NOW } from "./fake-points-store";

const DAY = 24 * 60 * 60 * 1000;

/** A lot for the tests, with sensible defaults. */
function lot(id: string, remaining: number, earnedDaysAgo: number, expiresInDays: number | null): PointsLot {
  return {
    id,
    guestId: "guest-1",
    earned: remaining,
    remaining,
    earnedAt: new Date(NOW.getTime() - earnedDaysAgo * DAY),
    expiresAt: expiresInDays === null ? null : new Date(NOW.getTime() + expiresInDays * DAY),
    sourceRef: `src:${id}`,
  };
}

describe("pointsForSpend", () => {
  it("earns the rate for each 1,000 UGX, rounded down", () => {
    const rules = { ...DEFAULT_POINTS_RULES, pointsPer1000Ugx: 2 };
    expect(pointsForSpend(rules, 5000)).toBe(10);
    expect(pointsForSpend(rules, 1999)).toBe(3); // 3.998 rounds down to 3
  });

  it("earns nothing for an amount under 500 UGX at 1 point per 1,000", () => {
    expect(pointsForSpend(DEFAULT_POINTS_RULES, 999)).toBe(0);
  });

  it("never returns a negative number", () => {
    expect(pointsForSpend(DEFAULT_POINTS_RULES, -5000)).toBe(0);
  });
});

describe("valueOfPoints and expiryFor", () => {
  it("values points at the shillings-per-point rate", () => {
    expect(valueOfPoints({ ...DEFAULT_POINTS_RULES, ugxPerPoint: 10 }, 250)).toBe(2500);
  });

  it("sets expiry the given number of days after earning", () => {
    const expiry = expiryFor({ ...DEFAULT_POINTS_RULES, expiryDays: 30 }, NOW);
    expect(expiry?.getTime()).toBe(NOW.getTime() + 30 * DAY);
  });

  it("never expires when the expiry is 0 days", () => {
    expect(expiryFor({ ...DEFAULT_POINTS_RULES, expiryDays: 0 }, NOW)).toBeNull();
  });
});

describe("balanceOf", () => {
  it("counts only lots that have not expired", () => {
    const lots = [lot("a", 40, 10, 20), lot("b", 60, 400, -5), lot("c", 10, 1, null)];
    expect(balanceOf(lots, NOW)).toBe(50);
  });
});

describe("spendOldestFirst", () => {
  it("takes from the oldest lot first and leaves the rest", () => {
    const lots = [lot("new", 50, 1, 300), lot("old", 30, 100, 200)];
    const result = spendOldestFirst(lots, 40, NOW);
    expect(result?.steps).toEqual([
      { lotId: "old", points: 30 },
      { lotId: "new", points: 10 },
    ]);
    expect(result?.changed.find((l) => l.id === "old")?.remaining).toBe(0);
    expect(result?.changed.find((l) => l.id === "new")?.remaining).toBe(40);
  });

  it("returns null when the guest does not have enough usable points", () => {
    const lots = [lot("a", 20, 1, 100), lot("expired", 500, 400, -1)];
    expect(spendOldestFirst(lots, 21, NOW)).toBeNull();
  });

  it("does not change the lots it was given", () => {
    const lots = [lot("a", 20, 1, 100)];
    spendOldestFirst(lots, 5, NOW);
    expect(lots[0]?.remaining).toBe(20);
  });
});
