/** When a scheduled report runs: once a hotel day; weekly on Mondays, monthly on the 1st (Kampala time). */

import { describe, expect, it } from "vitest";
import { isDue } from "../src/domain/report-due";

// 7 AM Kampala on Monday 1 Feb 2027 is 04:00 UTC.
const mondayFirst = new Date("2027-02-01T04:00:00Z");
const tuesday = new Date("2027-02-02T04:00:00Z");

describe("report due", () => {
  it("never runs a report with no schedule", () => {
    expect(isDue({ schedule: "none", lastRunAt: null }, mondayFirst)).toBe(false);
  });

  it("runs daily ones once per hotel day", () => {
    expect(isDue({ schedule: "daily", lastRunAt: null }, tuesday)).toBe(true);
    // Ran at 00:30 Kampala the same day (21:30 UTC the evening before).
    expect(isDue({ schedule: "daily", lastRunAt: new Date("2027-02-01T21:30:00Z") }, tuesday)).toBe(false);
    expect(isDue({ schedule: "daily", lastRunAt: new Date("2027-02-01T20:30:00Z") }, tuesday)).toBe(true);
  });

  it("runs weekly ones on Mondays and monthly ones on the 1st", () => {
    expect(isDue({ schedule: "weekly", lastRunAt: null }, mondayFirst)).toBe(true);
    expect(isDue({ schedule: "weekly", lastRunAt: null }, tuesday)).toBe(false);
    expect(isDue({ schedule: "monthly", lastRunAt: null }, mondayFirst)).toBe(true);
    expect(isDue({ schedule: "monthly", lastRunAt: null }, tuesday)).toBe(false);
  });
});
