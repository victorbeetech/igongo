"use client";
// One item opened: its QR text, stock per store and its last movements.

import { LiveData } from "@/shared/api/LiveData";
import { dayTimeOf } from "@/shared/format/when";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useItem, useStores } from "../../data/stockApi";
import { KIND_WORDS } from "../../domain/movement";
import { qtyText } from "./qty";

export function ItemDetail({ id }: { id: string }) {
  const item = useItem(id);
  const stores = useStores();
  const storeName = (sid: string | null) => (sid ? (stores.data?.items.find((s) => s.id === sid)?.name ?? "Store") : "");
  return (
    <section aria-label="Item detail" className="grid gap-2 rounded-md border border-line bg-surface p-3">
      <LiveData query={item} name="This item">
        {(d) => (
          <>
            <SectionHeader title={`${d.item.code} ${d.item.name}`} />
            <p className="text-caption text-muted">QR: {d.item.qr}. Units: {[d.item.unit, ...d.item.conversions.map((c) => `${c.unit} (${c.per} ${d.item.unit})`)].join(", ")}</p>
            <DataTable rows={d.balances} rowKey={(b) => b.storeId} empty="None in any store." columns={[{ label: "Store", cell: (b) => storeName(b.storeId) }, { label: "On hand", cell: (b) => qtyText(b.qty, d.item.unit) }]} />
            <DataTable
              rows={d.movements}
              rowKey={(m) => m.id}
              empty="No movements yet."
              columns={[
                { label: "No.", cell: (m) => m.number },
                { label: "What", cell: (m) => KIND_WORDS[m.kind] },
                { label: "Quantity", cell: (m) => qtyText(m.qty, d.item.unit) },
                { label: "From", cell: (m) => storeName(m.fromStoreId) },
                { label: "To", cell: (m) => storeName(m.toStoreId) },
                { label: "By", cell: (m) => m.byName },
                { label: "When", cell: (m) => dayTimeOf(m.at) },
              ]}
            />
          </>
        )}
      </LiveData>
    </section>
  );
}
