/** Points from food: whole 1,000-shilling steps times the rate the super admin set. */

import { describe, expect, it } from "vitest";
import { pointsEarned } from "../src/domain/points";

describe("pointsEarned", () => {
  it("is 0 while points are off (rate 0) or nothing was spent", () => {
    expect(pointsEarned(50_000, 0)).toBe(0);
    expect(pointsEarned(0, 5)).toBe(0);
  });

  it("gives the rate per whole 1,000 shillings and ignores the part under a step", () => {
    expect(pointsEarned(1_000, 5)).toBe(5);
    expect(pointsEarned(2_999, 5)).toBe(10);
    expect(pointsEarned(12_500, 2)).toBe(24);
  });
});
