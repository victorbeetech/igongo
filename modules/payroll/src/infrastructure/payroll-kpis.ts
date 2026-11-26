/** Payroll's numbers for the management dashboard: the latest pay run that is not cancelled. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { desc, ne } from "drizzle-orm";
import { payRuns } from "./db/schema";

export function payrollKpis(db: Database): KpiSource {
  return {
    module: "payroll",
    title: "Payroll (latest month)",
    async read() {
      const [run] = await db.select().from(payRuns).where(ne(payRuns.status, "cancelled")).orderBy(desc(payRuns.period)).limit(1);
      return [
        { key: "payroll.staff", label: `People paid${run ? ` (${run.period})` : ""}`, value: run?.staffCount ?? 0, unit: "count" },
        { key: "payroll.gross", label: "Gross pay", value: run?.gross ?? 0, unit: "ugx" },
        { key: "payroll.net", label: "Net pay", value: run?.net ?? 0, unit: "ugx" },
        { key: "payroll.employer", label: "Employer cost on top", value: run?.employerCost ?? 0, unit: "ugx" },
      ];
    },
  };
}
