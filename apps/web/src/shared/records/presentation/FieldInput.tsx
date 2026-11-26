"use client";
// One form input for a record field, drawn from the field's kind: text, long
// text, number, money, date, time, choice, yes/no, staff member, photo or
// phone. Used by every records-kit module's forms, so the super admin's new
// fields appear on every screen at once.

import { PhotoPicker } from "@/shared/files/PhotoPicker";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import type { FieldDef, FieldValue } from "../types/fieldDef";

/** The HTML input type for the plain kinds. */
const INPUT_TYPE: Partial<Record<FieldDef["kind"], string>> = { number: "number", money: "number", date: "date", time: "time", phone: "tel" };

interface FieldInputProps {
  field: FieldDef;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  /** The module key, for photo uploads. */
  module: string;
}

export function FieldInput({ field, value, onChange, module }: FieldInputProps) {
  const label = field.required ? `${field.label} *` : field.label;
  const text = value === null || value === undefined ? "" : String(value);
  switch (field.kind) {
    case "longtext":
      return <TextArea label={label} value={text} onChange={onChange} rows={3} required={field.required} />;
    case "select":
      return <SelectInput label={label} value={text} onChange={onChange} options={[["", "Choose…"], ...(field.options ?? []).map((o): [string, string] => [o, o])]} />;
    case "yesno":
      return <SwitchRow label={field.label} on={value === true} onChange={onChange} />;
    case "staff":
      return <StaffSelect label={label} value={text} onChange={onChange} />;
    case "photo":
      // One photo per photo field; the saved value is its file ID.
      return <PhotoPicker purpose={module} label={label} max={1} value={text ? [text] : []} onChange={(ids) => onChange(ids[0] ?? null)} />;
    default:
      return <TextInput label={label} value={text} onChange={onChange} type={INPUT_TYPE[field.kind] ?? "text"} required={field.required} />;
  }
}
