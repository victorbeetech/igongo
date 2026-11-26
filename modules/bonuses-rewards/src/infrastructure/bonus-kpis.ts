/** Bonuses & Rewards' numbers for the management dashboard. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { hotelDate, type Database } from "@igongo/core";
import { and, count, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { bonuses, buffetUses } from "./db/schema";

export function bonusKpis(db: Database): KpiSource {
  return {
    module: "bonuses-rewards",
    title: "Bonuses",
    async read({ from, to }) {
      const inRange = and(gte(bonuses.createdAt, from), lt(bonuses.createdAt, to));
      const [cash] = await db.select({ v: sql<number>`coalesce(sum(${bonuses.amount}), 0)` }).from(bonuses).where(and(inRange, eq(bonuses.kind, "cash"), inArray(bonuses.status, ["approved", "paid"])));
      const [given] = await db.select({ n: count() }).from(bonuses).where(inRange);
      const [meals] = await db.select({ n: count() }).from(buffetUses).where(and(gte(buffetUses.workDate, hotelDate(from)), lt(buffetUses.workDate, hotelDate(to))));
      return [
        { key: "bonuses.given", label: "Bonuses given", value: Number(given?.n ?? 0), unit: "count" },
        { key: "bonuses.cash", label: "Cash bonuses", value: Number(cash?.v ?? 0), unit: "ugx" },
        { key: "bonuses.buffet", label: "Buffet passes used", value: Number(meals?.n ?? 0), unit: "count" },
      ];
    },
  };
}
