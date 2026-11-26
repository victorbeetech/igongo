/** Advances & Loans' pure rules: limits, instalments and pay months. */

import { describe, expect, it } from "vitest";
import { instalmentOf } from "../src/domain/advance";
import { DEFAULT_ADVANCE_RULES, requestBreak } from "../src/domain/advance-rules";
import { nextMonth } from "../src/domain/pay-month";

describe("advance rules", () => {
  it("checks the super admin's limits", () => {
    const rules = { ...DEFAULT_ADVANCE_RULES, advance: { enabled: true, maxAmount: 200000, maxInstalments: 2 } };
    expect(requestBreak(rules, { kind: "advance", amount: 100000, instalments: 1 }, 0)).toBeNull();
    expect(requestBreak(rules, { kind: "advance", amount: 300000, instalments: 1 }, 0)).toMatch(/most/);
    expect(requestBreak(rules, { kind: "advance", amount: 100000, instalments: 3 }, 0)).toMatch(/2 months/);
    expect(requestBreak(rules, { kind: "advance", amount: 100000, instalments: 1 }, 1)).toMatch(/already/);
    expect(requestBreak(rules, { kind: "loan", amount: 100000, instalments: 1 }, 0)).toMatch(/loans are switched off/);
  });
  it("rounds instalments up and rolls months over the year", () => {
    expect(instalmentOf(100000, 3)).toBe(33334);
    expect(nextMonth("2026-12")).toBe("2027-01");
    expect(nextMonth("2026-09")).toBe("2026-10");
  });
});
