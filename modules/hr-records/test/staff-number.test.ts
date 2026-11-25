/** HR Records' pure rules: staff numbers. (The routes are tested end to end in apps/api.) */

import { describe, expect, it } from "vitest";
import { nextStaffNumber, staffNumberValue } from "../src/domain/staff-number";

describe("staff numbers", () => {
  it("run on from the highest, padded to four digits", () => {
    expect(nextStaffNumber(0)).toBe("IGG-0001");
    expect(nextStaffNumber(41)).toBe("IGG-0042");
    expect(staffNumberValue("IGG-0042")).toBe(42);
    expect(staffNumberValue("TEMP-1")).toBe(0);
  });
});
