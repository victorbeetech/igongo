/** Staff Meals' pure rules: which meal is being served now (hotel time, UTC+3). */

import { describe, expect, it } from "vitest";
import { DEFAULT_MEAL_RULES, mealServedAt } from "../src/domain/meal-rules";

describe("meal times", () => {
  it("finds the meal whose window holds the time", () => {
    expect(mealServedAt(DEFAULT_MEAL_RULES, new Date("2026-11-25T04:00:00Z"))?.key).toBe("breakfast"); // 07:00
    expect(mealServedAt(DEFAULT_MEAL_RULES, new Date("2026-11-25T10:30:00Z"))?.key).toBe("lunch"); // 13:30
    expect(mealServedAt(DEFAULT_MEAL_RULES, new Date("2026-11-25T13:00:00Z"))).toBeNull(); // 16:00
  });
});
