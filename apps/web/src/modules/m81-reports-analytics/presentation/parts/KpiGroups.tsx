// The tiles of several areas, one section each; an area that could not
// answer shows a note instead. Used by the dashboard and by report runs.

import type { DashboardGroup } from "@/modules/m81-reports-analytics/data/reportsApi";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { kpiShown } from "./kpiShown";

/** Every group's tiles. */
export function KpiGroups({ groups }: { groups: DashboardGroup[] }) {
  return (
    <>
      {groups.map((g) => (
        <section key={g.module} className="grid gap-2">
          <SectionHeader title={g.title} />
          {g.failed ? (
            <p className="text-caption text-muted">These numbers could not be read just now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{g.kpis.map((k) => <KpiCard key={k.key} label={k.label} value={kpiShown(k)} />)}</div>
          )}
        </section>
      ))}
    </>
  );
}
