"use client";
// S61-02 Menu editor and S61-03 Item editor: the hotel's venues (add, rename,
// switch on or off for guests, remove), then a form to add an item with price, prep time,
// portions and extras, allergens and tags. Prices are the hotel's, never code.

import { useState } from "react";
import { useAddItem, useMenuSettings } from "@/modules/m61-menu-catalogue/data/menuApi";
import { parseOptions } from "@/modules/m61-menu-catalogue/domain/parseOptions";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { OutletsManager } from "./OutletsManager";

export function MenuEditorPage({ screen }: { screen: ScreenContext }) {
  const settings = useMenuSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={settings} name="Outlets">
          {(s) => (
            <>
              <OutletsManager settings={s} />
              <ItemForm outlets={s.outlets.map((o) => [o.key, o.name])} />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** Adds one item. */
function ItemForm({ outlets }: { outlets: [string, string][] }) {
  const add = useAddItem();
  const blank = { outlet: outlets[0]?.[0] ?? "", section: "", name: "", description: "", price: "", prepMinutes: "15", options: "", tags: "", allergens: "" };
  const [v, setV] = useState(blank);
  const list = (t: string) => t.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  const submit = () =>
    add.mutate(
      { outlet: v.outlet, section: v.section, name: v.name, description: v.description || null, price: Number(v.price) || 0, prepMinutes: Number(v.prepMinutes) || 0, options: parseOptions(v.options), tags: list(v.tags), allergens: list(v.allergens) },
      { onSuccess: () => setV({ ...blank, outlet: v.outlet, section: v.section }) },
    );
  return (
    <Card className="grid gap-2">
      <h2 className="text-subtitle font-bold">Add an item</h2>
      <div className="grid gap-2 sm:grid-cols-3">
        <SelectInput label="Outlet" value={v.outlet} onChange={(outlet) => setV({ ...v, outlet })} options={outlets} />
        <TextInput label="Section, such as Grill" value={v.section} onChange={(section) => setV({ ...v, section })} />
        <TextInput label="Name" value={v.name} onChange={(name) => setV({ ...v, name })} />
        <TextInput label="Price (UGX)" type="number" value={v.price} onChange={(price) => setV({ ...v, price })} />
        <TextInput label="Prep time (minutes)" type="number" value={v.prepMinutes} onChange={(prepMinutes) => setV({ ...v, prepMinutes })} />
        <TextInput label="Tags: vegetarian, halal, spicy" value={v.tags} onChange={(tags) => setV({ ...v, tags })} />
        <TextInput label="Allergens: nuts, dairy" value={v.allergens} onChange={(allergens) => setV({ ...v, allergens })} />
      </div>
      <TextArea label="Description" value={v.description} onChange={(description) => setV({ ...v, description })} rows={2} />
      <TextArea label="Options, one group per line. Portion (required): Half kg = 0, 1 kg = 18000" value={v.options} onChange={(options) => setV({ ...v, options })} rows={3} />
      <Button onClick={submit} disabled={add.isPending || !v.outlet || v.name.length < 2}>Add item</Button>
    </Card>
  );
}
