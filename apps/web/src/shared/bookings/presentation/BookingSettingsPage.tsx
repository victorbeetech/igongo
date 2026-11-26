"use client";
// A booking module's settings (super admin or the module's manager): the
// rules (deposit, approval, cancel deadline, limit) and what is on sale,
// with prices, capacity and time slots, added and switched on or off here.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useAddOffering, useEditOffering, useOfferings, useRules, useSaveRules } from "../data/bookingsApi";
import type { BookingPlace } from "../types/bookingPlace";
import type { BookingRules } from "../types/bookingRules";
import type { OfferingKind } from "../types/offering";

/** The words for each kind on the add form. */
const KIND_WORDS: Record<OfferingKind, string> = { nights: "Stay (per night)", slot: "Ticket or pass (date and time)", stock: "Item in stock", enquiry: "Request priced by staff" };

export function BookingSettingsPage({ screen, place, kinds }: { screen: ScreenContext; place: BookingPlace; kinds: OfferingKind[] }) {
  const rules = useRules(place);
  const offerings = useOfferings(place, true);
  const edit = useEditOffering(place);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={rules} name="Rules">{(r) => <RulesForm place={place} initial={r} />}</LiveData>
        <SectionHeader title="On sale" />
        <LiveData query={offerings} name="Offerings">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(o) => o.id}
              empty="Nothing yet. Add the first one below."
              columns={[
                { label: "Name", cell: (o) => o.name },
                { label: "Price", cell: (o) => ugx(o.price) },
                { label: kinds.includes("stock") ? "In stock" : "Capacity", cell: (o) => o.capacity },
                { label: "Times", cell: (o) => o.slots.join(", ") || o.onDate || "-" },
                { label: "On sale", cell: (o) => <SwitchRow label={o.name} on={o.active} onChange={(active) => edit.mutate({ id: o.id, patch: { active } })} /> },
              ]}
            />
          )}
        </LiveData>
        <AddOfferingForm place={place} kinds={kinds} />
      </div>
    </>
  );
}

/** The rules form. */
function RulesForm({ place, initial }: { place: BookingPlace; initial: BookingRules }) {
  const save = useSaveRules(place);
  const [r, setR] = useState(initial);
  const num = (k: keyof BookingRules) => (v: string) => setR({ ...r, [k]: Number(v) || 0 });
  return (
    <Card className="grid gap-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <TextInput label="Deposit (% of total)" type="number" value={String(r.depositPercent)} onChange={num("depositPercent")} />
        <TextInput label="Cancel up to (hours before)" type="number" value={String(r.cancelHoursBefore)} onChange={num("cancelHoursBefore")} />
        <TextInput label="Most per booking" type="number" value={String(r.maxUnits)} onChange={num("maxUnits")} />
      </div>
      <SwitchRow label="Staff approve every booking" on={r.requireApproval} onChange={(requireApproval) => setR({ ...r, requireApproval })} />
      <Button onClick={() => save.mutate(r)} disabled={save.isPending}>Save rules</Button>
    </Card>
  );
}

/** Adds something to sell. */
function AddOfferingForm({ place, kinds }: { place: BookingPlace; kinds: OfferingKind[] }) {
  const add = useAddOffering(place);
  const blank = { kind: kinds[0] ?? "slot", name: "", description: "", price: "", capacity: "", slots: "", onDate: "" };
  const [v, setV] = useState(blank);
  const submit = () =>
    add.mutate(
      {
        kind: v.kind as OfferingKind, name: v.name, description: v.description || null, price: Number(v.price) || 0, capacity: Number(v.capacity) || 0,
        slots: v.slots.split(",").map((s) => s.trim()).filter(Boolean), onDate: v.onDate || null,
      },
      { onSuccess: () => setV(blank) },
    );
  return (
    <Card className="grid gap-2">
      <h3 className="text-subtitle font-bold">Add</h3>
      <div className="grid gap-2 sm:grid-cols-3">
        {kinds.length > 1 && <SelectInput label="Kind" value={v.kind} onChange={(kind) => setV({ ...v, kind: kind as OfferingKind })} options={kinds.map((k) => [k, KIND_WORDS[k]])} />}
        <TextInput label="Name" value={v.name} onChange={(name) => setV({ ...v, name })} />
        <TextInput label="Price (UGX)" type="number" value={v.price} onChange={(price) => setV({ ...v, price })} />
        <TextInput label={v.kind === "stock" ? "In stock" : v.kind === "nights" ? "Rooms of this type" : "Places"} type="number" value={v.capacity} onChange={(capacity) => setV({ ...v, capacity })} />
        {v.kind === "slot" && <TextInput label="Times, such as 09:00, 11:00 (empty: all day)" value={v.slots} onChange={(slots) => setV({ ...v, slots })} />}
        {v.kind === "slot" && <TextInput label="Only on (for an event)" type="date" value={v.onDate} onChange={(onDate) => setV({ ...v, onDate })} />}
      </div>
      <TextArea label="Description" value={v.description} onChange={(description) => setV({ ...v, description })} rows={2} />
      <Button onClick={submit} disabled={add.isPending || v.name.length < 2}>Add</Button>
    </Card>
  );
}
