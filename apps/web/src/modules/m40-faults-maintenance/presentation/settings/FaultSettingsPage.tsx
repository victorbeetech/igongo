"use client";
// S40-07 Maintenance settings: the fault categories (each sends faults to a
// department), likes, comments and whether a photo is required.

import { useState } from "react";
import { useFaultSettings, useSaveFaultSettings, type FaultSettings } from "@/modules/m40-faults-maintenance/data/faultsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The settings page. */
export function FaultSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useFaultSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
    </>
  );
}

/** A key from a name, such as "Plumbing" → "plumbing". */
const keyOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** The form, saved together. */
function SettingsForm({ initial }: { initial: FaultSettings }) {
  const save = useSaveFaultSettings();
  const [s, setS] = useState(initial);
  const [cat, setCat] = useState({ name: "", department: "" });
  return (
    <div className="grid max-w-2xl gap-3 p-4">
      <SwitchRow label="Likes on fault reports" on={s.likesEnabled} onChange={(likesEnabled) => setS({ ...s, likesEnabled })} />
      <SwitchRow label="Comments on fault reports" on={s.commentsEnabled} onChange={(commentsEnabled) => setS({ ...s, commentsEnabled })} />
      <SwitchRow label="A photo is required" on={s.photoRequired} onChange={(photoRequired) => setS({ ...s, photoRequired })} />
      <SectionHeader title="Categories" />
      {s.categories.length === 0 && <p className="text-caption text-muted">No categories yet. Faults go to the reporter&apos;s department.</p>}
      {s.categories.map((c) => (
        <div key={c.key} className="flex items-center justify-between gap-2">
          <span className="text-body">{`${c.name} → ${c.department ?? "reporter's department"}`}</span>
          <Button variant="text" onClick={() => setS({ ...s, categories: s.categories.filter((x) => x.key !== c.key) })}>Remove</Button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2">
        <TextInput label="New category" value={cat.name} onChange={(name) => setCat({ ...cat, name })} />
        <TextInput label="Department key" value={cat.department} onChange={(department) => setCat({ ...cat, department })} hint="Such as maintenance" />
        <Button variant="secondary" disabled={keyOf(cat.name).length < 2} onClick={() => { setS({ ...s, categories: [...s.categories, { key: keyOf(cat.name), name: cat.name.trim(), department: keyOf(cat.department) || null }] }); setCat({ name: "", department: "" }); }}>Add</Button>
      </div>
      <Button onClick={() => save.mutate(s)} disabled={save.isPending}>Save settings</Button>
    </div>
  );
}
