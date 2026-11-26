/** Food Ordering's numbers for the management dashboard: orders and sales. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, eq, gte, lt, ne, sum } from "drizzle-orm";
import { orders } from "./db/schema";

export function orderKpis(db: Database): KpiSource {
  return {
    module: "food-ordering",
    title: "Food orders",
    async read({ from, to }) {
      const inRange = and(gte(orders.createdAt, from), lt(orders.createdAt, to));
      const [all] = await db.select({ n: count(), value: sum(orders.total) }).from(orders).where(and(inRange, ne(orders.status, "cancelled")));
      const [cancelled] = await db.select({ n: count() }).from(orders).where(and(inRange, eq(orders.status, "cancelled")));
      return [
        { key: "food-ordering.orders", label: "Orders", value: Number(all?.n ?? 0), unit: "count" },
        { key: "food-ordering.sales", label: "Order value", value: Number(all?.value ?? 0), unit: "ugx" },
        { key: "food-ordering.cancelled", label: "Cancelled", value: Number(cancelled?.n ?? 0), unit: "count" },
      ];
    },
  };
}
