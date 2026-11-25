"use client";
// S38-03 Reports to sign (S38-05 Department reports) and S38-08 Missing
// reports: reports in my scope from the last two weeks, and who has not
// reported today.

import { useState } from "react";
import { REPORT_STATUS_WORDS, useMissing, useReports } from "@/modules/m38-daily-reports/data/reportsApi";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine } from "@/shared/api/types/staffRef";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { FilterChips } from "@/shared/ui/chip/FilterChips";
import { ListRow } from "@/shared/ui/list-row/ListRow";

const FILTERS: [string, string][] = [["Waiting", "submitted"], ["Signed", "signed"], ["Returned", "returned"], ["All", ""]];

/** S38-03: reports to sign. */
export function ReportsToSignPage({ screen }: { screen: ScreenContext }) {
  const [filter, setFilter] = useState("Waiting");
  const reports = useReports(FILTERS.find(([w]) => w === filter)?.[1] ?? "");
  const detail = catalog.screen("S38-06")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <FilterChips label="Status" options={FILTERS.map(([w]) => w)} value={filter} onChange={setFilter} />
        <LiveData query={reports} name="Reports" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <ul className="grid rounded-md border border-line bg-surface">
              {d.items.map((r) => <li key={r.id}><ListRow title={`${r.staff?.name ?? "Unknown"} · ${r.workDate}`} subtitle={staffLine(r.staff)} status={REPORT_STATUS_WORDS[r.status]} href={recordHref(detail, r.id)} /></li>)}
            </ul>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** S38-08: who has not reported today. */
export function MissingReportsPage({ screen }: { screen: ScreenContext }) {
  const missing = useMissing();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={missing} name="Missing reports" isEmpty={(d) => d.items.length === 0}>
          {(d) => <ul className="grid rounded-md border border-line bg-surface">{d.items.map((s) => <li key={s.staffId}><ListRow title={s.name} subtitle={staffLine(s)} status="Missed" /></li>)}</ul>}
        </LiveData>
      </div>
    </>
  );
}
