"use client";
// S84-01 Stock home and S84-19 Stock reports: how many items, how many are
// low, the stock value (for those who may see values), the low-stock list
// and a download of every balance per store.

import { LiveData } from "@/shared/api/LiveData";
import { downloadFile } from "@/shared/api/downloadFile";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useItems, useLow } from "../data/stockApi";
import type { StockItem } from "../domain/stockItem";
import { STOCK_PATH } from "../domain/place";
import { qtyText } from "./parts/qty";

export function StockHomePage({ screen }: { screen: ScreenContext }) {
  const items = useItems("");
  const low = useLow();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={items} name="Stock">{(d) => <Totals items={d.items} />}</LiveData>
        <SectionHeader title="Low stock" />
        <LiveData query={low} name="Low stock">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(i) => i.id}
              empty="Nothing is below its reorder level."
              columns={[
                { label: "Item", cell: (i) => `${i.code} ${i.name}` },
                { label: "On hand", cell: (i) => qtyText(i.onHand ?? 0, i.unit) },
                { label: "Reorder at", cell: (i) => qtyText(i.reorderLevel, i.unit) },
              ]}
            />
          )}
        </LiveData>
        <div>
          <Button variant="secondary" onClick={() => void downloadFile(`${STOCK_PATH}/export/balances`, "stock.csv")}>Download balances</Button>
        </div>
      </div>
    </>
  );
}

/** The headline numbers; the value shows only when the caller may see costs. */
function Totals({ items }: { items: StockItem[] }) {
  const priced = items.every((i) => i.avgCost !== null);
  const value = items.reduce((sum, i) => sum + (i.onHand ?? 0) * (i.avgCost ?? 0), 0);
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <KpiCard label="Items" value={String(items.length)} />
      <KpiCard label="Low" value={String(items.filter((i) => i.low).length)} />
      {priced && <KpiCard label="Stock value" value={ugx(Math.round(value))} />}
    </div>
  );
}
