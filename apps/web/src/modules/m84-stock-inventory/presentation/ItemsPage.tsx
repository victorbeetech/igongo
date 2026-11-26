"use client";
// S84-03 Items, S84-04 Item detail and S84-05 Item editor: search the items
// with their stock on hand, open one to see its stock per store and its
// ledger, and add a new item with its category, units and reorder level.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SearchField } from "@/shared/ui/search/SearchField";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useItems } from "../data/stockApi";
import { ItemDetail } from "./parts/ItemDetail";
import { ItemForm } from "./parts/ItemForm";
import { qtyText } from "./parts/qty";

export function ItemsPage({ screen, editor }: { screen: ScreenContext; editor?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState("");
  const items = useItems(q);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {editor && (
          <>
            <SectionHeader title="Add an item" />
            <ItemForm />
          </>
        )}
        <SearchField hint="Search items by name or code" value={q} onChange={setQ} />
        <LiveData query={items} name="Items">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(i) => i.id}
              empty="No items match."
              columns={[
                { label: "Code", cell: (i) => i.code },
                { label: "Item", cell: (i) => i.name },
                { label: "Category", cell: (i) => i.category },
                { label: "On hand", cell: (i) => qtyText(i.onHand ?? 0, i.unit) },
                { label: "Average cost", cell: (i) => (i.avgCost === null ? "Hidden" : ugx(i.avgCost)) },
                { label: "Level", cell: (i) => <StatusChip status={i.low ? "low" : "ok"} /> },
                { label: "", cell: (i) => <Button variant="secondary" onClick={() => setOpen(open === i.id ? "" : i.id)}>{open === i.id ? "Close" : "Open"}</Button> },
              ]}
            />
          )}
        </LiveData>
        {open && <ItemDetail id={open} />}
      </div>
    </>
  );
}
