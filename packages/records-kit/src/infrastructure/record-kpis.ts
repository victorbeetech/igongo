/** A records module's numbers for the management dashboard: added in the period, closed in the period, and open now. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, gte, isNull, lt } from "drizzle-orm";
import type { RecordModule } from "../application/record-module";
import type { RecordTables } from "./db/record-tables";

export function recordKpis(module: RecordModule, tables: RecordTables, db: Database, title: string): KpiSource {
  const r = tables.records;
  /** How many records match [where]. */
  const n = async (where: ReturnType<typeof and>) => Number((await db.select({ n: count() }).from(r).where(where))[0]?.n ?? 0);
  return {
    module: module.key,
    title,
    async read({ from, to }) {
      const [added, closed, open] = await Promise.all([
        n(and(gte(r.createdAt, from), lt(r.createdAt, to))),
        n(and(gte(r.closedAt, from), lt(r.closedAt, to))),
        n(isNull(r.closedAt)),
      ]);
      return [
        { key: `${module.key}.added`, label: "Added", value: added, unit: "count" },
        { key: `${module.key}.closed`, label: "Closed", value: closed, unit: "count" },
        { key: `${module.key}.open`, label: "Open now", value: open, unit: "count" },
      ];
    },
  };
}
