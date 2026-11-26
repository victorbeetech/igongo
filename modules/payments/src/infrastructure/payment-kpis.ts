/** Payments' numbers for the management dashboard: money in, by method. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { DrizzlePaymentRepository } from "./db/drizzle-payment-repository";

export function paymentKpis(db: Database): KpiSource {
  return {
    module: "payments",
    title: "Money in",
    async read({ from, to }) {
      const rows = await new DrizzlePaymentRepository(db).settlement(from, to);
      const byMethod = new Map<string, number>();
      for (const r of rows) byMethod.set(r.method, (byMethod.get(r.method) ?? 0) + r.net);
      return [
        { key: "payments.net", label: "Money in (after refunds)", value: rows.reduce((n, r) => n + r.net, 0), unit: "ugx" as const },
        { key: "payments.count", label: "Payments", value: rows.reduce((n, r) => n + r.count, 0), unit: "count" as const },
        ...[...byMethod.entries()].map(([method, value]) => ({ key: `payments.method.${method}`, label: method.replace(/_/g, " "), value, unit: "ugx" as const })),
      ];
    },
  };
}
