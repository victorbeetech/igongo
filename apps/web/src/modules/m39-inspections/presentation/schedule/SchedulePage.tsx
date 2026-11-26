"use client";
// S39-05 Inspection schedule: build checklists (lines, department, daily or
// weekly, due time), switch them off, and set likes and comments.

import { useState } from "react";
import { useChecklists, useInspectionSettings, useSaveChecklist, useSaveInspectionSettings, type Checklist, type ChecklistDraft, type InspectionSettings } from "@/modules/m39-inspections/data/inspectionsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** A key from words, such as "Fire exits clear" → "fire-exits-clear". */
const keyOf = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** The schedule page. */
export function SchedulePage({ screen }: { screen: ScreenContext }) {
  const lists = useChecklists();
  const settings = useInspectionSettings();
  const [editing, setEditing] = useState<Checklist | "new" | null>(null);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-3xl gap-3 p-4">
        <LiveData query={settings} name="Checkup settings">{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
        <SectionHeader title="Checklists" />
        <div><Button onClick={() => setEditing("new")}>New checklist</Button></div>
        {editing && <ChecklistForm key={editing === "new" ? "new" : editing.id} existing={editing === "new" ? null : editing} close={() => setEditing(null)} />}
        <LiveData query={lists} name="Checklists" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <>
              {d.items.map((c) => (
                <Card key={c.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-body font-bold">{`${c.name}${c.active ? "" : " (off)"}`}</span>
                    <Button variant="text" onClick={() => setEditing(c)}>Edit</Button>
                  </div>
                  <p className="text-caption text-muted">{`${c.department} · ${c.frequency} by ${c.dueBy} · ${c.items.length} lines`}</p>
                </Card>
              ))}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** Build or change one checklist; lines are typed one per line. */
function ChecklistForm({ existing, close }: { existing: Checklist | null; close: () => void }) {
  const save = useSaveChecklist();
  const [c, setC] = useState({ name: existing?.name ?? "", department: existing?.department ?? "", frequency: existing?.frequency ?? "daily", dueBy: existing?.dueBy ?? "10:00", active: existing?.active ?? true });
  const [lines, setLines] = useState((existing?.items ?? []).map((i) => i.label).join("\n"));
  const [photoOnFail, setPhotoOnFail] = useState(existing?.items[0]?.photoOnFail ?? true);
  const [raiseFault, setRaiseFault] = useState(existing?.items[0]?.raiseFault ?? true);
  function send() {
    // Step 1: turn the typed lines into items, keeping old keys for unchanged lines.
    const old = new Map((existing?.items ?? []).map((i) => [i.label, i.key]));
    const items = lines.split("\n").map((l) => l.trim()).filter((l) => l.length >= 2).map((label) => ({ key: old.get(label) ?? keyOf(label), label, photoOnFail, raiseFault }));
    const draft: ChecklistDraft = { ...c, department: keyOf(c.department), frequency: c.frequency as ChecklistDraft["frequency"], items };
    save.mutate({ id: existing?.id ?? null, draft }, { onSuccess: close });
  }
  return (
    <Card>
      <div className="grid gap-2">
        <TextInput label="Name" value={c.name} onChange={(name) => setC({ ...c, name })} required />
        <TextInput label="Department key" value={c.department} onChange={(department) => setC({ ...c, department })} hint="Such as housekeeping" />
        <SelectInput label="How often" value={c.frequency} onChange={(frequency) => setC({ ...c, frequency: frequency as "daily" | "weekly" })} options={[["daily", "Daily"], ["weekly", "Weekly"]]} />
        <TextInput label="Due by (24-hour time)" value={c.dueBy} onChange={(dueBy) => setC({ ...c, dueBy })} hint="Such as 10:00" />
        <TextArea label="Lines to check (one per line)" value={lines} onChange={setLines} rows={6} />
        <SwitchRow label="Ask for a photo when a line fails" on={photoOnFail} onChange={setPhotoOnFail} />
        <SwitchRow label="Open a fault report when a line fails" on={raiseFault} onChange={setRaiseFault} />
        <SwitchRow label="Checklist is on" on={c.active} onChange={(active) => setC({ ...c, active })} />
        <div className="flex gap-2">
          <Button onClick={send} disabled={save.isPending || !c.name.trim() || !lines.trim()}>Save checklist</Button>
          <Button variant="secondary" onClick={close}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}

/** The likes and comments switches. */
function SettingsForm({ initial }: { initial: InspectionSettings }) {
  const save = useSaveInspectionSettings();
  const [s, setS] = useState(initial);
  return (
    <div className="grid gap-2">
      <SwitchRow label="Likes on checkups" on={s.likesEnabled} onChange={(likesEnabled) => setS({ ...s, likesEnabled })} />
      <SwitchRow label="Comments on checkups" on={s.commentsEnabled} onChange={(commentsEnabled) => setS({ ...s, commentsEnabled })} />
      <div><Button variant="secondary" onClick={() => save.mutate(s)} disabled={save.isPending}>Save switches</Button></div>
    </div>
  );
}
