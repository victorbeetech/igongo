/**
 * The pure arithmetic of stock, with no database: unit conversion, which
 * stores a movement kind touches, and the new average cost after a
 * receipt. Tested in test/stock-math.test.ts.
 */

import { AppError } from "@igongo/core";
import type { MovementKind } from "./movement";
import type { StockItem } from "./stock-item";

/**
 * [qty] of [unit] in [item]'s base unit.
 * @throws AppError `bad_request` for a unit the item does not have
 */
export function toBaseUnits(item: StockItem, qty: number, unit?: string): number {
  if (!unit || unit === item.unit) return qty;
  const c = item.conversions.find((x) => x.unit === unit);
  if (!c) throw new AppError("bad_request", `${item.name} has no unit "${unit}". Add it to the item's conversions.`);
  return qty * c.per;
}

/** Which store sides [kind] needs: from (out), to (in), or either one for adjustments. */
export function sidesOf(kind: MovementKind): { from: boolean; to: boolean; either?: boolean } {
  switch (kind) {
    case "receive":
      return { from: false, to: true };
    case "issue":
    case "waste":
      return { from: true, to: false };
    case "transfer":
      return { from: true, to: true };
    case "adjust":
    case "count":
      return { from: false, to: false, either: true };
  }
}

/**
 * The average cost after receiving [qty] at [unitCost], when [onHand] was
 * held at [avgCost]. Whole shillings.
 */
export function newAverageCost(onHand: number, avgCost: number, qty: number, unitCost: number): number {
  const before = Math.max(onHand, 0);
  const total = before + qty;
  return total <= 0 ? unitCost : Math.round((before * avgCost + qty * unitCost) / total);
}

/** Rounds a quantity to three decimals (grams of a kilo). */
export const roundQty = (n: number) => Math.round(n * 1000) / 1000;
