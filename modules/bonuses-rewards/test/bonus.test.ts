/** Bonuses & Rewards' pure rules: when a buffet pass can be used. */

import { describe, expect, it } from "vitest";
import { hasPassFor, type Bonus } from "../src/domain/bonus";

const pass: Bonus = {
  id: "b", staffId: "s", staffName: "Sam", department: null, kind: "buffet", amount: 0, passes: 2, passesUsed: 0, validUntil: "2026-12-01",
  reason: "Star", status: "approved", awardedByName: "HR", decidedByName: "HR", decidedAt: null, payRunId: null, paidAt: null, createdAt: new Date(),
};

describe("buffet passes", () => {
  it("works while approved, not used up and not expired", () => {
    expect(hasPassFor(pass, "2026-11-30")).toBe(true);
    expect(hasPassFor(pass, "2026-12-02")).toBe(false);
    expect(hasPassFor({ ...pass, passesUsed: 2 }, "2026-11-30")).toBe(false);
    expect(hasPassFor({ ...pass, status: "pending" }, "2026-11-30")).toBe(false);
    expect(hasPassFor({ ...pass, kind: "cash" }, "2026-11-30")).toBe(false);
  });
});
