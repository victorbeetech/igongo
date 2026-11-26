"use client";
// The role drop-down at the top of the layout pages.

import { LiveData } from "@/shared/api/LiveData";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { useRoleChoices } from "../../data/layoutApi";

export function RolePicker({ value, onChange }: { value: string; onChange: (roleId: string) => void }) {
  const roles = useRoleChoices();
  return (
    <LiveData query={roles} name="Roles">
      {(d) => <SelectInput label="Role" value={value} onChange={onChange} options={[["", "Choose a role"], ...d.items.filter((r) => !r.archivedAt).map((r): [string, string] => [r.id, r.name])]} />}
    </LiveData>
  );
}
