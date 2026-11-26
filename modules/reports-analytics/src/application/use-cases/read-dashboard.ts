/**
 * Use case: the management dashboard (S81-01). Asks every source the viewer
 * may see, all at once; a source that fails is marked, not fatal, so one
 * broken module never takes the dashboard down. Hidden tiles are left out.
 */

import type { KpiRange, KpiSource } from "@igongo/contracts/reports-analytics";
import type { DashboardGroup } from "../../domain/dashboard-group";

export async function readDashboard(sources: KpiSource[], range: KpiRange, hidden: string[]): Promise<DashboardGroup[]> {
  return Promise.all(
    sources.map(async (s) => {
      try {
        const kpis = (await s.read(range)).filter((k) => !hidden.includes(k.key));
        return { module: s.module, title: s.title, kpis, failed: false };
      } catch {
        return { module: s.module, title: s.title, kpis: [], failed: true };
      }
    }),
  );
}
