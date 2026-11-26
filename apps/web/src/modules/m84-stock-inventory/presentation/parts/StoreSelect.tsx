"use client";
// A drop-down of stores. With [mineOnly], only the stores the caller may
// move stock in or out of (store keepers see the stores they keep).

import { SelectInput } from "@/shared/ui/field/SelectInput";
import type { Store } from "../../domain/store";

interface StoreSelectProps {
  label: string;
  stores: Store[];
  value: string;
  onChange: (id: string) => void;
  mineOnly?: boolean;
}

export function StoreSelect({ label, stores, value, onChange, mineOnly }: StoreSelectProps) {
  const shown = stores.filter((s) => s.active && (!mineOnly || s.mine));
  return <SelectInput label={label} value={value} onChange={onChange} options={[["", "Choose a store"], ...shown.map((s): [string, string] => [s.id, s.name])]} />;
}
