"use client";
// The fields of one offering. The add form and the change form both use it, so they
// always ask for the same things. Slot times and the event date show only for kinds
// that use them.

import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import type { OfferingKind } from "../../types/offering";
import type { OfferingDraft } from "./offeringDraft";

/** The words for each kind on the add form. */
const KIND_WORDS: Record<OfferingKind, string> = {
  nights: "Stay (per night)",
  slot: "Ticket or pass (date and time)",
  stock: "Item in stock",
  enquiry: "Request priced by staff",
};

/** The label of the number box, which means something different for each kind. */
function capacityLabel(kind: OfferingKind): string {
  if (kind === "stock") return "In stock";
  if (kind === "nights") return "Rooms of this type";
  return "Places";
}

interface OfferingFieldsProps {
  /** The values being typed. */
  draft: OfferingDraft;
  /** The kinds this module sells. The kind choice shows only when adding and there is more than one. */
  kinds: OfferingKind[];
  /** True when changing an offering that exists, so its kind cannot change. */
  editing: boolean;
  /** Called with the whole new set of values after each change. */
  onChange: (draft: OfferingDraft) => void;
}

/** The form fields for one offering. */
export function OfferingFields({ draft, kinds, editing, onChange }: OfferingFieldsProps) {
  // Changes one field and keeps the others as they are.
  const set = (field: keyof OfferingDraft) => (value: string) => onChange({ ...draft, [field]: value });
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {!editing && kinds.length > 1 && (
          <SelectInput label="Kind" value={draft.kind} onChange={(kind) => onChange({ ...draft, kind: kind as OfferingKind })} options={kinds.map((k) => [k, KIND_WORDS[k]])} />
        )}
        <TextInput label="Name" value={draft.name} onChange={set("name")} />
        <TextInput label="Price (UGX)" type="number" value={draft.price} onChange={set("price")} />
        <TextInput label={capacityLabel(draft.kind)} type="number" value={draft.capacity} onChange={set("capacity")} />
        {draft.kind === "slot" && <TextInput label="Times, such as 09:00, 11:00 (empty: all day)" value={draft.slots} onChange={set("slots")} />}
        {draft.kind === "slot" && <TextInput label="Only on (for an event)" type="date" value={draft.onDate} onChange={set("onDate")} />}
      </div>
      <TextArea label="Description" value={draft.description} onChange={set("description")} rows={2} />
    </>
  );
}
