/** Inspections' numbers for the management dashboard. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { hotelDate, type Database } from "@igongo/core";
import { and, avg, count, gte, lt, sum } from "drizzle-orm";
import { runs } from "./db/schema";

export function inspectionKpis(db: Database): KpiSource {
  return {
    module: "inspections",
    title: "Checkups",
    async read({ from, to }) {
      const [row] = await db
        .select({ n: count(), score: avg(runs.score), faults: sum(runs.faults) })
        .from(runs)
        .where(and(gte(runs.workDate, hotelDate(from)), lt(runs.workDate, hotelDate(to))));
      return [
        { key: "inspections.done", label: "Checkups done", value: Number(row?.n ?? 0), unit: "count" },
        { key: "inspections.score", label: "Average score", value: Math.round(Number(row?.score ?? 0)), unit: "percent" },
        { key: "inspections.faults", label: "Failed checks", value: Number(row?.faults ?? 0), unit: "count" },
      ];
    },
  };
}
