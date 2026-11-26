"use client";
// S84-02 Stores: every store with its kind, department and keeper, open or
// closed, and a form to add one. Store keepers reach only the stores they keep.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useAddStore, useEditStore, useStores } from "../data/stockApi";

export function StoresPage({ screen }: { screen: ScreenContext }) {
  const stores = useStores();
  const edit = useEditStore();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={stores} name="Stores">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(s) => s.id}
              empty="No stores yet. Add the first one below."
              columns={[
                { label: "Store", cell: (s) => s.name },
                { label: "Kind", cell: (s) => s.kind },
                { label: "Department", cell: (s) => s.department ?? "Any" },
                { label: "Status", cell: (s) => <StatusChip status={s.active ? "open" : "closed"} /> },
                { label: "", cell: (s) => <Button variant="secondary" disabled={edit.isPending} onClick={() => edit.mutate({ id: s.id, active: !s.active })}>{s.active ? "Close" : "Open"}</Button> },
              ]}
            />
          )}
        </LiveData>
        <SectionHeader title="Add a store" />
        <AddStore />
      </div>
    </>
  );
}

/** The add-a-store form; it clears after saving. */
function AddStore() {
  const add = useAddStore();
  const blank = { name: "", kind: "", department: "", keeper: "", location: "" };
  const [f, setF] = useState(blank);
  const set = (k: keyof typeof blank) => (v: string) => setF({ ...f, [k]: v });
  const save = () =>
    add.mutate(
      { name: f.name, kind: f.kind, department: f.department.trim() || null, keeperStaffId: f.keeper || null, location: f.location.trim() || null },
      { onSuccess: () => setF(blank) },
    );
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <TextInput label="Name" value={f.name} onChange={set("name")} required />
      <TextInput label="Kind (such as Kitchen or Linen)" value={f.kind} onChange={set("kind")} required />
      <TextInput label="Department that uses it" value={f.department} onChange={set("department")} />
      <TextInput label="Where it is" value={f.location} onChange={set("location")} />
      <StaffSelect label="Store keeper" value={f.keeper} onChange={set("keeper")} />
      <div className="self-end">
        <Button onClick={save} disabled={add.isPending || !f.name.trim() || !f.kind.trim()}>Add store</Button>
      </div>
    </div>
  );
}
