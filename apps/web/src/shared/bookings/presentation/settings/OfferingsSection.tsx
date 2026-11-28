"use client";
// The "On sale" table: every offering with its price, capacity and times. Staff with
// the offerings permission can switch each one on or off and open it to change. Others
// see the same table read-only.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import { ugx } from "@/shared/format/ugx";
import { Button } from "@/shared/ui/button/Button";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { DataTable, type Column } from "@/shared/ui/table/DataTable";
import { useEditOffering, useOfferings } from "../../data/bookingsApi";
import type { BookingPlace } from "../../types/bookingPlace";
import type { Offering, OfferingKind } from "../../types/offering";
import { EditOfferingCard } from "./EditOfferingCard";

interface OfferingsSectionProps {
  place: BookingPlace;
  kinds: OfferingKind[];
  /** True when the signed-in person may add and change offerings. */
  canChange: boolean;
}

/** Lists what is on sale, and the change form for the one picked. */
export function OfferingsSection({ place, kinds, canChange }: OfferingsSectionProps) {
  // Staff see hidden and switched-off offerings too (`all`), so they can switch them back on.
  const offerings = useOfferings(place, true);
  const edit = useEditOffering(place);
  // The id of the offering whose change form is open, or null when none is open.
  const [changingId, setChangingId] = useState<string | null>(null);

  // Columns shared by both views; the last two only appear for people who can change offerings.
  const columns: Column<Offering>[] = [
    { label: "Name", cell: (o) => o.name },
    { label: "Price", cell: (o) => ugx(o.price) },
    { label: kinds.includes("stock") ? "In stock" : "Capacity", cell: (o) => o.capacity },
    { label: "Times", cell: (o) => o.slots.join(", ") || o.onDate || "-" },
    {
      label: "On sale",
      cell: (o) => (canChange ? <SwitchRow label={o.name} on={o.active} onChange={(active) => edit.mutate({ id: o.id, patch: { active } })} /> : o.active ? "Yes" : "No"),
    },
    ...(canChange ? [{ label: "Change", cell: (o: Offering) => <Button variant="text" onClick={() => setChangingId(o.id)}>Change</Button> }] : []),
  ];

  return (
    <LiveData query={offerings} name="Offerings">
      {(d) => {
        // The offering whose change form is open, if it is still in the list.
        const changing = d.items.find((o) => o.id === changingId) ?? null;
        return (
          <>
            <DataTable rows={d.items} rowKey={(o) => o.id} empty="Nothing yet. Add the first one below." columns={columns} />
            {canChange && changing && <EditOfferingCard key={changing.id} place={place} kinds={kinds} offering={changing} onDone={() => setChangingId(null)} />}
          </>
        );
      }}
    </LiveData>
  );
}
