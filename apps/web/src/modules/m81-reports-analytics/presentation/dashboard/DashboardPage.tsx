"use client";
// S81-01 and S81-02 Dashboard: today's (or a chosen range's) numbers from
// every module the viewer may see, grouped by area. A module that fails to
// answer shows a note and the rest still load. Refreshes every minute.

import { useState } from "react";
import { rangeQuery, useDashboard, type DayRange } from "@/modules/m81-reports-analytics/data/reportsApi";
import { downloadFile } from "@/shared/api/downloadFile";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiGroups } from "../parts/KpiGroups";

/** The dashboard. */
export function DashboardPage({ screen }: { screen: ScreenContext }) {
  const [draft, setDraft] = useState<DayRange>({ from: "", to: "" });
  const [range, setRange] = useState<DayRange>({ from: "", to: "" });
  const dashboard = useDashboard(range);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-end gap-2">
          <TextInput label="From" type="date" value={draft.from} onChange={(from) => setDraft({ ...draft, from })} />
          <TextInput label="To" type="date" value={draft.to} onChange={(to) => setDraft({ ...draft, to })} />
          <Button variant="secondary" disabled={!draft.from || !draft.to || draft.from > draft.to} onClick={() => setRange(draft)}>Show</Button>
          <Button variant="text" onClick={() => { setDraft({ from: "", to: "" }); setRange({ from: "", to: "" }); }}>Default range</Button>
          <Button variant="secondary" onClick={() => void downloadFile(`/api/reports/dashboard/export.csv${rangeQuery(range)}`, "dashboard.csv")}>Download spreadsheet</Button>
        </div>
        <LiveData query={dashboard} name="Dashboard" isEmpty={(d) => d.groups.length === 0}>
          {(d) => (
            <>
              <p className="text-caption text-muted">{d.from === d.to ? `Hotel day ${d.from}` : `Hotel days ${d.from} to ${d.to}`}</p>
              <KpiGroups groups={d.groups} />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
