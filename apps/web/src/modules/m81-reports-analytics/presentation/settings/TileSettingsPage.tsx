"use client";
// S81-06 Targets and alerts (tile settings for now): which tiles show on
// the dashboard and the range it opens with.

import { useState } from "react";
import { useCatalogue, useDashboardSettings, useSaveDashboardSettings, type DashboardSettings } from "@/modules/m81-reports-analytics/data/reportsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The settings page. */
export function TileSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useDashboardSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
    </>
  );
}

/** Every tile with a switch, and the default range. */
function SettingsForm({ initial }: { initial: DashboardSettings }) {
  const catalogue = useCatalogue();
  const save = useSaveDashboardSettings();
  const [s, setS] = useState(initial);
  const toggle = (key: string, on: boolean) => setS({ ...s, hidden: on ? s.hidden.filter((k) => k !== key) : [...s.hidden, key] });
  return (
    <div className="grid max-w-2xl gap-3 p-4">
      <SelectInput label="The dashboard opens on" value={String(s.defaultDays)} onChange={(v) => setS({ ...s, defaultDays: Number(v) as DashboardSettings["defaultDays"] })} options={[["1", "Today"], ["7", "The last 7 days"], ["30", "The last 30 days"]]} />
      <LiveData query={catalogue} name="Tiles" isEmpty={(d) => d.groups.length === 0}>
        {(d) => (
          <>
            {d.groups.map((g) => (
              <div key={g.module} className="grid gap-1">
                <SectionHeader title={g.title} />
                {g.kpis.map((k) => <SwitchRow key={k.key} label={k.label} on={!s.hidden.includes(k.key)} onChange={(on) => toggle(k.key, on)} />)}
              </div>
            ))}
          </>
        )}
      </LiveData>
      <Button disabled={save.isPending} onClick={() => save.mutate(s)}>Save settings</Button>
    </div>
  );
}
