/** Payroll's pure rules: tax bands and one payslip worked out. */

import { describe, expect, it } from "vitest";
import { computePayslip } from "../src/domain/compute-payslip";
import { bandTax, type DeductionRule } from "../src/domain/deduction-rule";

/** Example bands for the test only; each hotel enters its own. */
const bands = [{ upTo: 200000, rate: 0 }, { upTo: 400000, rate: 10 }, { upTo: null, rate: 30 }];

describe("payroll sums", () => {
  it("taxes each part of pay at its band's rate", () => {
    expect(bandTax(150000, bands)).toBe(0);
    expect(bandTax(300000, bands)).toBe(10000);
    expect(bandTax(500000, bands)).toBe(20000 + 30000);
  });

  it("adds allowances and bonuses, then takes rules, advances and adjustments", () => {
    const paye: DeductionRule = { key: "paye", name: "PAYE", kind: "bands", rate: 0, amount: 0, bands, base: "gross", employerRate: 0 };
    const fund: DeductionRule = { key: "fund", name: "Fund", kind: "percent", rate: 5, amount: 0, bands: [], base: "gross", employerRate: 10 };
    const slip = computePayslip({
      id: "p", runId: "r", period: "2026-11",
      staff: { staffId: "s", name: "Sam", staffNumber: "IGG-0001", department: "kitchen" },
      profile: { basic: 400000, allowances: [{ name: "Transport", amount: 50000 }] },
      bonuses: [{ bonusId: "b", staffId: "s", amount: 50000, reason: "Star" }],
      advances: [{ advanceId: "a", number: "ADV-0001", staffId: "s", amount: 30000 }],
      adjustments: [{ name: "Overtime", amount: 20000 }, { name: "Broken plate", amount: -5000 }],
      rules: [paye, fund],
    });
    expect(slip.gross).toBe(520000);
    expect(slip.deductions).toEqual([
      { name: "PAYE", amount: 20000 + 36000 },
      { name: "Fund", amount: 26000 },
      { name: "Advance ADV-0001", amount: 30000 },
      { name: "Broken plate", amount: 5000 },
    ]);
    expect(slip.net).toBe(520000 - 117000);
    expect(slip.employer).toEqual([{ name: "Fund", amount: 52000 }]);
    expect(slip.bonusIds).toEqual(["b"]);
  });
});
