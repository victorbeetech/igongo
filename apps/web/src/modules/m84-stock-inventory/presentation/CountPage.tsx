"use client";
// S84-15 Stock count: pick a store and an item, type what is on the shelf,
// and the ledger books the difference as a count correction.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { useCount, useItems, useStores } from "../data/stockApi";
import { ItemSelect } from "./parts/ItemSelect";
import { StoreSelect } from "./parts/StoreSelect";

export function CountPage({ screen }: { screen: ScreenContext }) {
  const stores = useStores();
  const items = useItems("");
  const count = useCount();
  const blank = { storeId: "", itemId: "", counted: "", note: "" };
  const [f, setF] = useState(blank);
  const set = (k: keyof typeof blank) => (v: string) => setF({ ...f, [k]: v });
  const ready = f.storeId && f.itemId && f.counted !== "" && Number(f.counted) >= 0;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        <LiveData query={stores} name="Stores">{(d) => <StoreSelect label="Store" stores={d.items} value={f.storeId} onChange={set("storeId")} mineOnly />}</LiveData>
        <LiveData query={items} name="Items">{(d) => <ItemSelect items={d.items} value={f.itemId} onChange={set("itemId")} />}</LiveData>
        <TextInput label="Counted on the shelf (base units)" type="number" value={f.counted} onChange={set("counted")} required />
        <TextInput label="Note" value={f.note} onChange={set("note")} />
        <div>
          <Button disabled={count.isPending || !ready} onClick={() => count.mutate({ storeId: f.storeId, itemId: f.itemId, counted: Number(f.counted), note: f.note.trim() || null }, { onSuccess: () => setF({ ...blank, storeId: f.storeId }) })}>Save count</Button>
        </div>
      </div>
    </>
  );
}
