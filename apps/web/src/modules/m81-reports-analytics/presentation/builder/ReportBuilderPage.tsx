"use client";
// S81-03 Report builder: name a report, pick the areas (every area the
// viewer may see, or some of them), the days it covers and whether it runs
// by itself at 7 AM. Saving opens Saved reports.

import { useState } from "react";
import { useDashboard } from "@/modules/m81-reports-analytics/data/reportsApi";
import { DAY_CHOICES, SCHEDULE_CHOICES, useCreateReport, type SavedReportInput } from "@/modules/m81-reports-analytics/data/savedReportsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

const EMPTY: SavedReportInput = { name: "", modules: [], days: 7, schedule: "none" };

/** The builder. */
export function ReportBuilderPage({ screen }: { screen: ScreenContext }) {
  // The areas come from the dashboard the viewer sees today.
  const areas = useDashboard({ from: "", to: "" });
  const create = useCreateReport();
  const address = useAddress();
  const [r, setR] = useState(EMPTY);
  const toggle = (module: string, on: boolean) => setR({ ...r, modules: on ? [...r.modules, module] : r.modules.filter((m) => m !== module) });
  const save = () => create.mutate({ ...r, name: r.name.trim() }, { onSuccess: () => address.push(hrefFor("S81-04", address.path)) });
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-2xl gap-3 p-4">
        <TextInput label="Report name" value={r.name} onChange={(name) => setR({ ...r, name })} />
        <SelectInput label="Covers" value={String(r.days)} onChange={(v) => setR({ ...r, days: Number(v) as SavedReportInput["days"] })} options={DAY_CHOICES} />
        <SelectInput label="Runs" value={r.schedule} onChange={(v) => setR({ ...r, schedule: v as SavedReportInput["schedule"] })} options={SCHEDULE_CHOICES} />
        <SectionHeader title="Areas" />
        <p className="text-caption text-muted">{r.modules.length ? `${r.modules.length} picked.` : "None picked: the report covers every area you can see."}</p>
        <LiveData query={areas} name="Areas" isEmpty={(d) => d.groups.length === 0}>
          {(d) => (
            <div className="grid gap-1">
              {d.groups.map((g) => <SwitchRow key={g.module} label={g.title} on={r.modules.includes(g.module)} onChange={(on) => toggle(g.module, on)} />)}
            </div>
          )}
        </LiveData>
        <Button disabled={!r.name.trim() || create.isPending} onClick={save}>{create.isPending ? "Saving…" : "Save report"}</Button>
      </div>
    </>
  );
}
