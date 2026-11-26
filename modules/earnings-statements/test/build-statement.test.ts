/** Earnings Statements' pure rules: lifetime and yearly totals. */

import { describe, expect, it } from "vitest";
import { buildStatement } from "../src/domain/build-statement";

const staff = { staffId: "s", userId: "u", staffNumber: "IGG-0001", name: "Sam", department: "kitchen", jobTitle: null, photoUrl: null, status: "active" as const };
const slip = (period: string, gross: number, net: number) => ({ payslipId: period, payRunId: "r", period, staffId: "s", staffName: "Sam", staffNumber: "IGG-0001", department: "kitchen", basic: gross, earnings: [], gross, deductions: [], totalDeductions: gross - net, net, status: "paid", paidAt: null });

describe("lifetime statement", () => {
  it("adds every year's pay, bonuses and advances", () => {
    const s = buildStatement(
      staff,
      [slip("2026-11", 500000, 400000), slip("2025-12", 450000, 380000)],
      [
        { bonusId: "b1", kind: "cash", amount: 50000, passes: 0, passesUsed: 0, reason: "Star", status: "paid", createdAt: new Date("2026-10-01") },
        { bonusId: "b2", kind: "buffet", amount: 0, passes: 3, passesUsed: 1, reason: "Team", status: "approved", createdAt: new Date("2026-10-01") },
        { bonusId: "b3", kind: "cash", amount: 99999, passes: 0, passesUsed: 0, reason: "No", status: "declined", createdAt: new Date("2026-10-01") },
      ],
      [{ advanceId: "a", number: "ADV-0001", kind: "advance", amount: 100000, repaid: 40000, status: "disbursed", requestedAt: new Date("2026-09-01") }],
    );
    expect(s.lifetime).toMatchObject({ gross: 950000, net: 780000, cashBonuses: 50000, buffetPasses: 3, buffetPassesUsed: 1, advancesTaken: 100000, advancesRepaid: 40000, payslips: 2 });
    expect(s.years.map((y) => y.year)).toEqual(["2026", "2025"]);
    expect(s.years[0]?.totals.net).toBe(400000);
  });
});
