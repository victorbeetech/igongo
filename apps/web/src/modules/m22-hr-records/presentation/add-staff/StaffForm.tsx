"use client";
// The staff profile form, shared by Add staff (S22-03) and the edit part of
// Staff profile (S22-02). Empty boxes are sent as "not known" (null).

import { useState, type FormEvent } from "react";
import type { StaffDraft, StaffMember } from "@/modules/m22-hr-records/data/staffApi";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The text fields, in form order, with their labels. */
const FIELDS: [keyof StaffDraft, string, string?][] = [
  ["name", "Full name"],
  ["department", "Department (such as kitchen)"],
  ["jobTitle", "Job title"],
  ["phone", "Phone", "tel"],
  ["email", "Work email", "email"],
  ["hireDate", "First working day", "date"],
  ["emergencyContact", "Emergency contact"],
  ["userId", "Sign-in account ID (from Accounts)"],
];

/** The form; [onSave] gets only filled fields, empty ones as null. */
export function StaffForm({ initial, onSave, busy, action }: { initial?: StaffMember; onSave: (d: StaffDraft) => void; busy: boolean; action: string }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(FIELDS.map(([k]) => [k, String(initial?.[k] ?? "")])));
  function submit(event: FormEvent) {
    event.preventDefault();
    // Turn "" into null so the API clears the field.
    onSave(Object.fromEntries(FIELDS.map(([k]) => [k, values[k]?.trim() ? values[k]!.trim() : null])) as StaffDraft);
  }
  return (
    <form onSubmit={submit} className="grid max-w-lg gap-3">
      {FIELDS.map(([key, label, type]) => (
        <TextInput key={key} label={label} type={type ?? "text"} value={values[key] ?? ""} onChange={(v) => setValues({ ...values, [key]: v })} required={key === "name"} />
      ))}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : action}</Button>
    </form>
  );
}
