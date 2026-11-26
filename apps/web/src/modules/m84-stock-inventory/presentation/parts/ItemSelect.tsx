"use client";
// A drop-down of active stock items, by code and name.

import { SelectInput } from "@/shared/ui/field/SelectInput";
import type { StockItem } from "../../domain/stockItem";

export function ItemSelect({ items, value, onChange }: { items: StockItem[]; value: string; onChange: (id: string) => void }) {
  return <SelectInput label="Item" value={value} onChange={onChange} options={[["", "Choose an item"], ...items.filter((i) => i.active).map((i): [string, string] => [i.id, `${i.code} ${i.name}`])]} />;
}
