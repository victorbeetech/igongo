"use client";
// Pick one active staff member. Used to assign a fault, give a reward, open
// a statement and more.

import { staffLine } from "@/shared/api/types/staffRef";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { useActiveStaff } from "./useActiveStaff";

/** A staff picker; the value is a staff ID, or "" for none. */
export function StaffSelect({ label = "Staff member", value, onChange }: { label?: string; value: string; onChange: (staffId: string) => void }) {
  const staff = useActiveStaff();
  // While loading or refused, the picker shows a single line saying so.
  const options: [string, string][] = staff.data ? [["", "Choose…"], ...staff.data.items.map((s): [string, string] => [s.staffId, staffLine(s)])] : [["", staff.isError ? "Staff list unavailable" : "Loading staff…"]];
  return <SelectInput label={label} value={value} onChange={onChange} options={options} />;
}
