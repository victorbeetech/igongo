/** Guest CRM's numbers for the management dashboard: new and total guests, and who agreed to messages. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, gte, lt, sql } from "drizzle-orm";
import { profiles } from "./db/schema";

export function guestKpis(db: Database): KpiSource {
  return {
    module: "crm-guests",
    title: "Guests (CRM)",
    async read({ from, to }) {
      const [fresh] = await db.select({ n: count() }).from(profiles).where(and(gte(profiles.createdAt, from), lt(profiles.createdAt, to)));
      const [all] = await db.select({ n: count(), consent: sql<number>`count(*) filter (where ${profiles.consent}::text like '%true%')` }).from(profiles);
      return [
        { key: "crm-guests.new", label: "New guests", value: Number(fresh?.n ?? 0), unit: "count" },
        { key: "crm-guests.total", label: "Guests on record", value: Number(all?.n ?? 0), unit: "count" },
        { key: "crm-guests.consent", label: "Agreed to messages", value: Number(all?.consent ?? 0), unit: "count" },
      ];
    },
  };
}
