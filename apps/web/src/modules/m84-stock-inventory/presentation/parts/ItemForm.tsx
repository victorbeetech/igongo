"use client";
// The add-an-item form (S84-05): code, name, category and base unit from the
// super admin's lists, an optional bigger unit (a 50 kg sack), the reorder
// level and whether batches and expiry dates are asked for on receipt.

import { useState } from "react";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useAddItem, useStockSettings } from "../../data/stockApi";

const BLANK = { code: "", name: "", category: "", unit: "", bigUnit: "", per: "", reorder: "", expiry: false };

export function ItemForm() {
  const settings = useStockSettings();
  const add = useAddItem();
  const [f, setF] = useState(BLANK);
  const set = (k: keyof typeof BLANK) => (v: string) => setF({ ...f, [k]: v });
  const opts = (list: string[] | undefined): [string, string][] => [["", "Choose"], ...(list ?? []).map((x): [string, string] => [x, x])];
  const ready = f.code.trim() && f.name.trim() && f.category && f.unit;
  const save = () =>
    add.mutate(
      {
        code: f.code.trim().toUpperCase(),
        name: f.name.trim(),
        category: f.category,
        unit: f.unit,
        conversions: f.bigUnit && Number(f.per) > 0 ? [{ unit: f.bigUnit, per: Number(f.per) }] : [],
        reorderLevel: Number(f.reorder) || 0,
        tracksExpiry: f.expiry,
      },
      { onSuccess: () => setF(BLANK) },
    );
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <TextInput label="Code (also its QR)" value={f.code} onChange={set("code")} required />
      <TextInput label="Name" value={f.name} onChange={set("name")} required />
      <SelectInput label="Category" value={f.category} onChange={set("category")} options={opts(settings.data?.categories)} />
      <SelectInput label="Base unit" value={f.unit} onChange={set("unit")} options={opts(settings.data?.units)} />
      <SelectInput label="Bigger unit (optional)" value={f.bigUnit} onChange={set("bigUnit")} options={opts(settings.data?.units)} />
      <TextInput label="Base units in one bigger unit" type="number" value={f.per} onChange={set("per")} />
      <TextInput label="Reorder level (base units)" type="number" value={f.reorder} onChange={set("reorder")} />
      <SwitchRow label="Ask for batch and expiry on receipt" on={f.expiry} onChange={(expiry) => setF({ ...f, expiry })} />
      <div>
        <Button onClick={save} disabled={add.isPending || !ready}>Add item</Button>
      </div>
    </div>
  );
}
