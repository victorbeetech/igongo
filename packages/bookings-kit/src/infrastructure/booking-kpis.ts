/** A booking module's numbers for the management dashboard: bookings made and their value. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, gte, lt, ne, sum } from "drizzle-orm";
import type { BookingModule } from "../application/booking-module";
import type { BookingTables } from "./db/booking-tables";

export function bookingKpis(module: BookingModule, tables: BookingTables, db: Database, title: string): KpiSource {
  const b = tables.bookings;
  return {
    module: module.key,
    title,
    async read({ from, to }) {
      const [row] = await db
        .select({ n: count(), value: sum(b.total) })
        .from(b)
        .where(and(gte(b.createdAt, from), lt(b.createdAt, to), ne(b.status, "cancelled")));
      return [
        { key: `${module.key}.bookings`, label: "Bookings made", value: Number(row?.n ?? 0), unit: "count" },
        { key: `${module.key}.value`, label: "Booked value", value: Number(row?.value ?? 0), unit: "ugx" },
      ];
    },
  };
}
