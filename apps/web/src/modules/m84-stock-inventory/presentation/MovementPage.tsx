"use client";
// S84-07 Receive goods, S84-10 Issue stock, S84-11 Transfers, S84-17
// Wastage and S84-16 Count variances: a form for one kind of stock movement
// (none for count corrections, which come from counts) and that kind's ledger.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useItems, useMovements, usePostMovement, useStores } from "../data/stockApi";
import { KIND_WORDS, type MovementKind } from "../domain/movement";
import type { StockItem } from "../domain/stockItem";
import type { Store } from "../domain/store";
import { ItemSelect } from "./parts/ItemSelect";
import { StoreSelect } from "./parts/StoreSelect";

/** The kinds staff post by hand. */
type HandKind = Exclude<MovementKind, "count">;

export function MovementPage({ screen, kind }: { screen: ScreenContext; kind: MovementKind }) {
  const list = useMovements(kind);
  const stores = useStores();
  const items = useItems("");
  const storeName = (id: string | null) => (id ? (stores.data?.items.find((s) => s.id === id)?.name ?? "Store") : "");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {kind !== "count" && stores.data && items.data && <MovementForm kind={kind} stores={stores.data.items} items={items.data.items} />}
        <SectionHeader title={KIND_WORDS[kind]} />
        <LiveData query={list} name={KIND_WORDS[kind]}>
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(m) => m.id}
              empty="Nothing yet."
              columns={[
                { label: "No.", cell: (m) => m.number },
                { label: "Item", cell: (m) => m.itemName },
                { label: "Quantity", cell: (m) => String(m.qty) },
                { label: "From", cell: (m) => storeName(m.fromStoreId) },
                { label: "To", cell: (m) => storeName(m.toStoreId) },
                { label: "Reference", cell: (m) => m.reference ?? m.issuedTo ?? "" },
                { label: "Note", cell: (m) => m.note ?? "" },
                { label: "By", cell: (m) => m.byName },
                { label: "When", cell: (m) => dayTimeOf(m.at) },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}

/** The form for one [kind]; it asks only for the stores that kind needs. */
function MovementForm({ kind, stores, items }: { kind: HandKind; stores: Store[]; items: StockItem[] }) {
  const post = usePostMovement();
  const blank = { itemId: "", qty: "", unit: "", from: "", to: "", cost: "", reference: "", note: "" };
  const [f, setF] = useState(blank);
  const set = (k: keyof typeof blank) => (v: string) => setF({ ...f, [k]: v });
  const item = items.find((i) => i.id === f.itemId);
  const units = item ? [item.unit, ...item.conversions.map((c) => c.unit)] : [];
  const needsFrom = kind === "issue" || kind === "transfer" || kind === "waste";
  const needsTo = kind === "receive" || kind === "transfer";
  const save = () =>
    post.mutate(
      {
        kind,
        itemId: f.itemId,
        qty: Number(f.qty),
        ...(f.unit ? { unit: f.unit } : {}),
        ...(needsFrom || (kind === "adjust" && f.from) ? { fromStoreId: f.from || null } : {}),
        ...(needsTo || (kind === "adjust" && !f.from) ? { toStoreId: f.to || null } : {}),
        ...(kind === "receive" && f.cost ? { unitCost: Number(f.cost) } : {}),
        reference: f.reference.trim() || null,
        ...(kind === "issue" ? { issuedTo: f.reference.trim() || null } : {}),
        note: f.note.trim() || null,
      },
      { onSuccess: () => setF(blank) },
    );
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <ItemSelect items={items} value={f.itemId} onChange={set("itemId")} />
      <TextInput label="Quantity" type="number" value={f.qty} onChange={set("qty")} required />
      {units.length > 1 && <TextInput label={`Unit (${units.join(", ")})`} value={f.unit} onChange={set("unit")} />}
      {(needsFrom || kind === "adjust") && <StoreSelect label={kind === "adjust" ? "Take out of (or leave empty to add)" : "Out of store"} stores={stores} value={f.from} onChange={set("from")} mineOnly />}
      {(needsTo || (kind === "adjust" && !f.from)) && <StoreSelect label="Into store" stores={stores} value={f.to} onChange={set("to")} mineOnly={kind !== "transfer"} />}
      {kind === "receive" && <TextInput label="Price per unit typed (UGX)" type="number" value={f.cost} onChange={set("cost")} />}
      <TextInput label={kind === "issue" ? "Issued to (person or department)" : "Reference (order, supplier or requisition code)"} value={f.reference} onChange={set("reference")} />
      <TextInput label={kind === "waste" || kind === "adjust" ? "Reason" : "Note"} value={f.note} onChange={set("note")} />
      <div>
        <Button onClick={save} disabled={post.isPending || !f.itemId || !(Number(f.qty) > 0)}>Save {KIND_WORDS[kind].toLowerCase()}</Button>
      </div>
    </div>
  );
}
