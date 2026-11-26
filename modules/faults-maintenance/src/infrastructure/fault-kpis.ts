/** Faults & Maintenance's numbers for the management dashboard. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, gte, inArray, lt, notInArray } from "drizzle-orm";
import { faults } from "./db/schema";

export function faultKpis(db: Database): KpiSource {
  return {
    module: "faults-maintenance",
    title: "Faults and maintenance",
    async read({ from, to }) {
      const [reported] = await db.select({ n: count() }).from(faults).where(and(gte(faults.createdAt, from), lt(faults.createdAt, to)));
      const [fixed] = await db.select({ n: count() }).from(faults).where(and(gte(faults.fixedAt, from), lt(faults.fixedAt, to)));
      const [open] = await db.select({ n: count() }).from(faults).where(notInArray(faults.status, ["fixed", "closed", "cancelled"]));
      const [urgent] = await db.select({ n: count() }).from(faults).where(and(notInArray(faults.status, ["fixed", "closed", "cancelled"]), inArray(faults.priority, ["high", "urgent"])));
      return [
        { key: "faults.reported", label: "Faults reported", value: Number(reported?.n ?? 0), unit: "count" },
        { key: "faults.fixed", label: "Faults fixed", value: Number(fixed?.n ?? 0), unit: "count" },
        { key: "faults.open", label: "Open now", value: Number(open?.n ?? 0), unit: "count" },
        { key: "faults.urgent", label: "Open high or urgent", value: Number(urgent?.n ?? 0), unit: "count" },
      ];
    },
  };
}
