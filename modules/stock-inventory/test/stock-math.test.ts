/** Stock's pure rules: units, store sides, average cost, and who reaches which store. */

import { describe, expect, it } from "vitest";
import { reachesStore } from "../src/application/store-reach";
import type { Store } from "../src/domain/store";
import type { StockItem } from "../src/domain/stock-item";
import { newAverageCost, sidesOf, toBaseUnits } from "../src/domain/stock-math";

const rice: StockItem = { id: "i", code: "RICE", name: "Rice", category: "Food", unit: "kg", conversions: [{ unit: "sack", per: 50 }], reorderLevel: 20, avgCost: 0, tracksExpiry: false, photoId: null, extra: {}, active: true, updatedAt: new Date() };
const kitchen: Store = { id: "s", name: "Kitchen store", kind: "Kitchen", department: "kitchen", keeperStaffId: "stf_k", location: null, active: true };

describe("stock math", () => {
  it("converts units to the base unit", () => {
    expect(toBaseUnits(rice, 2, "sack")).toBe(100);
    expect(toBaseUnits(rice, 3)).toBe(3);
    expect(() => toBaseUnits(rice, 1, "crate")).toThrow(/no unit/);
  });

  it("knows which stores each movement touches", () => {
    expect(sidesOf("receive")).toEqual({ from: false, to: true });
    expect(sidesOf("transfer")).toEqual({ from: true, to: true });
    expect(sidesOf("adjust").either).toBe(true);
  });

  it("averages the cost over what is on hand", () => {
    expect(newAverageCost(0, 0, 100, 3000)).toBe(3000);
    expect(newAverageCost(100, 3000, 100, 4000)).toBe(3500);
    expect(newAverageCost(-5, 3000, 10, 4000)).toBe(4000);
  });

  it("lets store keepers reach their own stores and chefs their department's", () => {
    expect(reachesStore({ scope: "assigned", staffId: "stf_k", department: null }, kitchen)).toBe(true);
    expect(reachesStore({ scope: "assigned", staffId: "stf_x", department: "kitchen" }, kitchen)).toBe(false);
    expect(reachesStore({ scope: "department", staffId: "stf_x", department: "kitchen" }, kitchen)).toBe(true);
    expect(reachesStore({ scope: "all", staffId: null, department: null }, kitchen)).toBe(true);
    expect(reachesStore({ scope: null, staffId: "stf_k", department: null }, kitchen)).toBe(false);
  });
});
