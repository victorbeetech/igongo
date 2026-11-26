/** Attendance's numbers for the management dashboard: who came, and who was late. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import { hotelDate, type Database } from "@igongo/core";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { clockEvents } from "./db/schema";

export function attendanceKpis(db: Database): KpiSource {
  return {
    module: "attendance",
    title: "Attendance",
    async read({ from, to }) {
      const days = and(eq(clockEvents.kind, "in"), gte(clockEvents.workDate, hotelDate(from)), lt(clockEvents.workDate, hotelDate(to)));
      // One person counts once a day; late is the days they came in late.
      const [row] = await db
        .select({ shifts: sql<number>`count(distinct (${clockEvents.staffId}, ${clockEvents.workDate}))`, late: sql<number>`count(distinct (${clockEvents.staffId}, ${clockEvents.workDate})) filter (where ${clockEvents.late})`, people: sql<number>`count(distinct ${clockEvents.staffId})` })
        .from(clockEvents)
        .where(days);
      return [
        { key: "attendance.people", label: "Staff who came in", value: Number(row?.people ?? 0), unit: "count" },
        { key: "attendance.days", label: "Staff days worked", value: Number(row?.shifts ?? 0), unit: "count" },
        { key: "attendance.late", label: "Late arrivals", value: Number(row?.late ?? 0), unit: "count" },
      ];
    },
  };
}
