"use client";
// S54-01 Guests list: find guests and clients by name, phone or email, with
// their tags, and add a walk-in guest at the desk.

import { useState } from "react";
import { useAddWalkIn, useGuests } from "@/modules/m54-crm-guests/data/crmApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextInput } from "@/shared/ui/field/TextInput";
import { DataTable } from "@/shared/ui/table/DataTable";

export function GuestsListPage({ screen }: { screen: ScreenContext }) {
  const [q, setQ] = useState("");
  const guests = useGuests(q);
  const add = useAddWalkIn();
  const [w, setW] = useState({ name: "", phone: "" });
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <TextInput label="Search by name, phone or email" value={q} onChange={setQ} />
        <LiveData query={guests} name="Guests">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(g) => g.id}
              empty="No guests found."
              columns={[
                { label: "Name", cell: (g) => g.name },
                { label: "Phone", cell: (g) => g.phone ?? "-" },
                { label: "Email", cell: (g) => g.email ?? "-" },
                { label: "Tags", cell: (g) => g.tags.join(", ") || "-" },
                { label: "Allergies", cell: (g) => g.allergies ?? "-" },
              ]}
            />
          )}
        </LiveData>
        <Card className="grid gap-2 sm:grid-cols-3">
          <TextInput label="Walk-in guest's name" value={w.name} onChange={(name) => setW({ ...w, name })} />
          <TextInput label="Phone" type="tel" value={w.phone} onChange={(phone) => setW({ ...w, phone })} />
          <Button disabled={add.isPending || w.name.length < 2} onClick={() => add.mutate({ name: w.name, ...(w.phone ? { phone: w.phone } : {}) }, { onSuccess: () => setW({ name: "", phone: "" }) })}>Add guest</Button>
        </Card>
      </div>
    </>
  );
}
