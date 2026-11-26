"use client";
// A records module's settings (super admin or the module's manager): the
// record types, each type's fields (Custom Fields) and statuses (Workflow),
// and the module's switches. Everything here is data: saving changes every
// screen of the app and the web at once, with no code change. Old records
// keep their saved values when a field or status is removed.

import { useState } from "react";
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
import { useRecordConfig, useSaveRecordConfig } from "../data/recordsApi";
import { FIELD_KINDS, type FieldDef } from "../types/fieldDef";
import type { RecordConfig, RecordType, StatusDef } from "../types/recordConfig";
import type { RecordPlace } from "../types/recordPlace";

/** The words for each field kind. */
const KIND_WORDS: Record<FieldDef["kind"], string> = { text: "Short text", longtext: "Long text", number: "Number", money: "Money (UGX)", date: "Date", time: "Time", select: "Choice", yesno: "Yes or no", staff: "Staff member", photo: "Photo", phone: "Phone" };

/** A stable key from words, such as "Where found" -> "where_found", kept unique in [taken]. */
function keyFrom(words: string, taken: string[]): string {
  const base = words.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").replace(/^(\d)/, "f$1").slice(0, 30) || "field";
  let key = base;
  for (let i = 2; taken.includes(key); i++) key = `${base}_${i}`;
  return key;
}

export function RecordSettingsPage({ screen, place }: { screen: ScreenContext; place: RecordPlace }) {
  const config = useRecordConfig(place);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={config} name="Settings">{(c) => <ConfigEditor place={place} initial={c} />}</LiveData>
      </div>
    </>
  );
}

/** The editor, holding the set-up until Save. */
function ConfigEditor({ place, initial }: { place: RecordPlace; initial: RecordConfig }) {
  const save = useSaveRecordConfig(place);
  const [c, setC] = useState(initial);
  const [newType, setNewType] = useState("");
  /** Replaces type [i] with [t]. */
  const setType = (i: number, t: RecordType | null) => setC({ ...c, types: t ? c.types.map((x, j) => (j === i ? t : x)) : c.types.filter((_, j) => j !== i) });
  return (
    <>
      <Card className="grid gap-2">
        <SwitchRow label="Comments on records" on={c.comments} onChange={(comments) => setC({ ...c, comments })} />
        <TextArea label="Notice shown on this module's screens" value={c.notice} onChange={(notice) => setC({ ...c, notice })} rows={2} />
      </Card>
      {c.types.map((t, i) => <TypeEditor key={t.key} type={t} onChange={(x) => setType(i, x)} />)}
      <Card className="flex flex-wrap items-end gap-2">
        <TextInput label="New record type" value={newType} onChange={setNewType} />
        <Button variant="secondary" disabled={newType.trim().length < 2} onClick={() => (setC({ ...c, types: [...c.types, { key: keyFrom(newType, c.types.map((t) => t.key)), name: newType.trim(), active: true, fields: [], statuses: [{ key: "open", label: "Open" }, { key: "done", label: "Done", done: true }] }] }), setNewType(""))}>Add type</Button>
      </Card>
      <Button onClick={() => save.mutate(c)} disabled={save.isPending}>Save settings</Button>
    </>
  );
}

/** One record type: its name, switches, fields and statuses. */
function TypeEditor({ type: t, onChange }: { type: RecordType; onChange: (t: RecordType | null) => void }) {
  const [field, setField] = useState("");
  const [status, setStatus] = useState("");
  const setF = (i: number, f: FieldDef | null) => onChange({ ...t, fields: f ? t.fields.map((x, j) => (j === i ? f : x)) : t.fields.filter((_, j) => j !== i) });
  const setS = (i: number, s: StatusDef | null) => onChange({ ...t, statuses: s ? t.statuses.map((x, j) => (j === i ? s : x)) : t.statuses.filter((_, j) => j !== i) });
  return (
    <Card className="grid gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <TextInput label="Type name" value={t.name} onChange={(name) => onChange({ ...t, name })} />
        <SwitchRow label="On" on={t.active} onChange={(active) => onChange({ ...t, active })} />
        <SwitchRow label="Staff and guests raise their own" on={!!t.selfService} onChange={(selfService) => onChange({ ...t, selfService })} />
        <Button variant="danger" onClick={() => onChange(null)}>Remove type</Button>
      </div>
      <SectionHeader title="Fields" />
      {t.fields.map((f, i) => (
        <div key={f.key} className="flex flex-wrap items-end gap-2">
          <TextInput label="Label" value={f.label} onChange={(label) => setF(i, { ...f, label })} />
          <SelectInput label="Kind" value={f.kind} onChange={(kind) => setF(i, { ...f, kind: kind as FieldDef["kind"] })} options={FIELD_KINDS.map((k): [string, string] => [k, KIND_WORDS[k]])} />
          {f.kind === "select" && <TextInput label="Choices, separated by commas" value={(f.options ?? []).join(", ")} onChange={(o) => setF(i, { ...f, options: o.split(",").map((x) => x.trim()).filter(Boolean) })} />}
          <SwitchRow label="Required" on={!!f.required} onChange={(required) => setF(i, { ...f, required })} />
          <SwitchRow label="In lists" on={!!f.inList} onChange={(inList) => setF(i, { ...f, inList })} />
          <Button variant="text" onClick={() => setF(i, null)}>Remove</Button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2">
        <TextInput label="New field" value={field} onChange={setField} />
        <Button variant="secondary" disabled={!field.trim()} onClick={() => (onChange({ ...t, fields: [...t.fields, { key: keyFrom(field, t.fields.map((f) => f.key)), label: field.trim(), kind: "text" }] }), setField(""))}>Add field</Button>
      </div>
      <SectionHeader title="Statuses, in order (the first is where new records start)" />
      {t.statuses.map((s, i) => (
        <div key={s.key} className="flex flex-wrap items-end gap-2">
          <TextInput label="Status" value={s.label} onChange={(label) => setS(i, { ...s, label })} />
          <SwitchRow label="Needs an approver" on={!!s.approval} onChange={(approval) => setS(i, { ...s, approval })} />
          <SwitchRow label="Closes the record" on={!!s.done} onChange={(done) => setS(i, { ...s, done })} />
          {t.statuses.length > 1 && <Button variant="text" onClick={() => setS(i, null)}>Remove</Button>}
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2">
        <TextInput label="New status" value={status} onChange={setStatus} />
        <Button variant="secondary" disabled={!status.trim()} onClick={() => (onChange({ ...t, statuses: [...t.statuses, { key: keyFrom(status, t.statuses.map((s) => s.key)), label: status.trim() }] }), setStatus(""))}>Add status</Button>
      </div>
    </Card>
  );
}
