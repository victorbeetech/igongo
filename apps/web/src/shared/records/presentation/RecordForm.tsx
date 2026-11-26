"use client";
// The add form for one record type: the type's own fields (set by the super
// admin), plus the day, the place and, for staff, who does it and who it is
// for. The API cleans and checks everything again.

import { useState } from "react";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { useCreateRecord } from "../data/recordsApi";
import type { FieldValue } from "../types/fieldDef";
import type { RecordType } from "../types/recordConfig";
import type { RecordPlace } from "../types/recordPlace";
import type { WorkRecord } from "../types/workRecord";
import { FieldInput } from "./FieldInput";

interface RecordFormProps {
  place: RecordPlace;
  /** The types this form may add; a picker shows when there are several. */
  types: RecordType[];
  /** Shows the staff-only parts (assign, raise for someone else). */
  staff?: boolean;
  /** Called with the saved record. */
  onSaved?: (record: WorkRecord) => void;
}

export function RecordForm({ place, types, staff, onSaved }: RecordFormProps) {
  const [typeKey, setTypeKey] = useState(types[0]?.key ?? "");
  const type = types.find((t) => t.key === typeKey) ?? types[0];
  const [fields, setFields] = useState<Record<string, FieldValue>>({});
  const [extra, setExtra] = useState({ dueOn: "", location: "", assigneeId: "", ownerName: "" });
  const create = useCreateRecord(place);
  if (!type) return <p className="text-body">Nothing can be added here yet. The super admin sets the record types in the settings.</p>;
  const missing = type.fields.some((f) => f.required && (fields[f.key] === undefined || fields[f.key] === null || fields[f.key] === ""));
  const submit = () =>
    create.mutate(
      {
        type: type.key,
        fields,
        ...(extra.dueOn ? { dueOn: extra.dueOn } : {}),
        ...(extra.location ? { location: extra.location } : {}),
        ...(staff && extra.assigneeId ? { assigneeId: extra.assigneeId } : {}),
        ...(staff && extra.ownerName ? { ownerName: extra.ownerName } : {}),
      },
      { onSuccess: (r) => (setFields({}), setExtra({ dueOn: "", location: "", assigneeId: "", ownerName: "" }), onSaved?.(r)) },
    );
  return (
    <Card className="grid gap-2">
      {types.length > 1 && <SelectInput label="What to add" value={type.key} onChange={(k) => (setTypeKey(k), setFields({}))} options={types.map((t): [string, string] => [t.key, t.name])} />}
      <div className="grid gap-2 sm:grid-cols-2">
        {type.fields.map((f) => (
          <FieldInput key={f.key} field={f} module={place.module} value={fields[f.key] ?? null} onChange={(v) => setFields({ ...fields, [f.key]: v })} />
        ))}
        <TextInput label="Day (when it is due or happens)" type="date" value={extra.dueOn} onChange={(dueOn) => setExtra({ ...extra, dueOn })} />
        <TextInput label="Where" value={extra.location} onChange={(location) => setExtra({ ...extra, location })} />
        {staff && <StaffSelect label="Give it to (optional)" value={extra.assigneeId} onChange={(assigneeId) => setExtra({ ...extra, assigneeId })} />}
        {staff && <TextInput label="For someone else (their name, optional)" value={extra.ownerName} onChange={(ownerName) => setExtra({ ...extra, ownerName })} />}
      </div>
      <Button onClick={submit} disabled={create.isPending || missing}>{`Add ${type.name.toLowerCase()}`}</Button>
    </Card>
  );
}
