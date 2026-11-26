/** Advances & Loans' numbers for the management dashboard. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { advances } from "./db/schema";

export function advanceKpis(db: Database): KpiSource {
  return {
    module: "advances-loans",
    title: "Advances and loans",
    async read({ from, to }) {
      const [asked] = await db.select({ n: count() }).from(advances).where(and(gte(advances.requestedAt, from), lt(advances.requestedAt, to)));
      const [waiting] = await db.select({ n: count() }).from(advances).where(eq(advances.status, "requested"));
      const [owed] = await db.select({ v: sql<number>`coalesce(sum(${advances.amount} - ${advances.repaid}), 0)` }).from(advances).where(eq(advances.status, "disbursed"));
      return [
        { key: "advances.requested", label: "Requests", value: Number(asked?.n ?? 0), unit: "count" },
        { key: "advances.waiting", label: "Waiting for a decision", value: Number(waiting?.n ?? 0), unit: "count" },
        { key: "advances.owed", label: "Still owed by staff", value: Number(owed?.v ?? 0), unit: "ugx" },
      ];
    },
  };
}
