/** Stock's numbers for the management dashboard: stock value now, items low, and movements in the period. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, gte, lt } from "drizzle-orm";
import { DrizzleItemRepository } from "./db/drizzle-item-repository";
import { DrizzleMovementRepository } from "./db/drizzle-movement-repository";
import { movements } from "./db/schema";

export function stockKpis(db: Database): KpiSource {
  return {
    module: "stock-inventory",
    title: "Stock",
    async read({ from, to }) {
      const [items, balances, moved] = await Promise.all([
        new DrizzleItemRepository(db).list({ activeOnly: true }),
        new DrizzleMovementRepository(db).balances({}),
        db.select({ n: count() }).from(movements).where(and(gte(movements.at, from), lt(movements.at, to))),
      ]);
      // On hand per item, all stores together.
      const onHand = new Map<string, number>();
      for (const b of balances) onHand.set(b.itemId, (onHand.get(b.itemId) ?? 0) + b.qty);
      const value = items.reduce((v, i) => v + Math.round((onHand.get(i.id) ?? 0) * i.avgCost), 0);
      const low = items.filter((i) => (onHand.get(i.id) ?? 0) <= i.reorderLevel && i.reorderLevel > 0).length;
      return [
        { key: "stock-inventory.value", label: "Stock value", value, unit: "ugx" },
        { key: "stock-inventory.low", label: "Items low", value: low, unit: "count" },
        { key: "stock-inventory.movements", label: "Stock movements", value: Number(moved[0]?.n ?? 0), unit: "count" },
      ];
    },
  };
}
