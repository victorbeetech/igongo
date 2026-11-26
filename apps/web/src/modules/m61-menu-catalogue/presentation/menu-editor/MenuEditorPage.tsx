"use client";
// S61-02 Menu editor and S61-03 Item editor: the hotel's outlets (and which
// show to guests), then a form to add an item with price, prep time,
// portions and extras, allergens and tags. Prices are the hotel's, never code.

import { useState } from "react";
import { useAddItem, useMenuSettings, useSaveMenuSettings } from "@/modules/m61-menu-catalogue/data/menuApi";
import type { MenuSettings } from "@/shared/api/types/menuSettings";
import { parseOptions } from "@/modules/m61-menu-catalogue/domain/parseOptions";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";

export function MenuEditorPage({ screen }: { screen: ScreenContext }) {
  const settings = useMenuSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={settings} name="Outlets">
          {(s) => (
            <>
              <OutletsForm initial={s} />
              <ItemForm outlets={s.outlets.map((o) => [o.key, o.name])} />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** Outlets, one per line as `key, name, client` (client: shown to guests). */
function OutletsForm({ initial }: { initial: MenuSettings }) {
  const save = useSaveMenuSettings();
  const [text, setText] = useState(initial.outlets.map((o) => `${o.key}, ${o.name}${initial.clientOutlets.includes(o.key) ? ", client" : ""}`).join("\n"));
  const submit = () => {
    const rows = text.split("\n").map((l) => l.split(",").map((x) => x.trim())).filter((r) => r[0] && r[1]);
    save.mutate({ outlets: rows.map((r) => ({ key: r[0] ?? "", name: r[1] ?? "" })), clientOutlets: rows.filter((r) => r[2] === "client").map((r) => r[0] ?? "") });
  };
  return (
    <Card className="grid gap-2">
      <h2 className="text-subtitle font-bold">Outlets</h2>
      <TextArea label="One per line: key, name, client (client = guests can order)" value={text} onChange={setText} rows={4} />
      <Button onClick={submit} disabled={save.isPending}>Save outlets</Button>
    </Card>
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
