/** Inspections' pure rules: the score and when a weekly checklist starts. */

import { describe, expect, it } from "vitest";
import { periodStart } from "../src/application/use-cases/period-start";
import { scoreOf } from "../src/domain/check-result";

describe("checkup rules", () => {
  it("scores passed lines out of checked ones, leaving n/a out", () => {
    expect(scoreOf([{ result: "ok" }, { result: "ok" }, { result: "fault" }, { result: "na" }])).toBe(67);
    expect(scoreOf([{ result: "na" }])).toBe(100);
  });
  it("starts a weekly checklist on Monday", () => {
    expect(periodStart("2026-11-26", "weekly")).toBe("2026-11-23");
    expect(periodStart("2026-11-23", "weekly")).toBe("2026-11-23");
    expect(periodStart("2026-11-29", "weekly")).toBe("2026-11-23");
    expect(periodStart("2026-11-26", "daily")).toBe("2026-11-26");
  });
});
