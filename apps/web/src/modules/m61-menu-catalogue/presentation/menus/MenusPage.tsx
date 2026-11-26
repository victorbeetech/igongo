"use client";
// S61-01 Menus and S61-04 Out of stock today: every item by outlet and
// section, with the kitchen's out-of-stock switch (back on by itself the
// next day) and the on-sale switch.

import { useState } from "react";
import { useEditItem, useMenuItems, useOutlets, useSetStock } from "@/modules/m61-menu-catalogue/data/menuApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { DataTable } from "@/shared/ui/table/DataTable";

export function MenusPage({ screen }: { screen: ScreenContext }) {
  const outlets = useOutlets();
  const [outlet, setOutlet] = useState("");
  const items = useMenuItems(outlet, true);
  const stock = useSetStock();
  const edit = useEditItem();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <SelectInput label="Outlet" value={outlet} onChange={setOutlet} options={[["", "Every outlet"], ...(outlets.data?.items ?? []).map((o): [string, string] => [o.key, o.name])]} />
        <LiveData query={items} name="Menu items">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(i) => i.id}
              empty="No items yet. Add them on the menu editor."
              columns={[
                { label: "Section", cell: (i) => i.section },
                { label: "Item", cell: (i) => i.name },
                { label: "Price", cell: (i) => ugx(i.price) },
                { label: "Prep", cell: (i) => `${i.prepMinutes} min` },
                { label: "In stock today", cell: (i) => <SwitchRow label={`${i.name} in stock`} on={i.available || !i.active} disabled={!i.active} onChange={(inStock) => stock.mutate({ id: i.id, inStock })} /> },
                { label: "On sale", cell: (i) => <SwitchRow label={`${i.name} on sale`} on={i.active} onChange={(active) => edit.mutate({ id: i.id, patch: { active } })} /> },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
