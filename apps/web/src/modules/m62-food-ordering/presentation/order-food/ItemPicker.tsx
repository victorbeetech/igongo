"use client";
// One menu item with its options (one list per group) and an Add button.
// The price shown adds the options; the API prices it again when ordering.

import { useState } from "react";
import type { MenuItem } from "@/shared/api/types/menuItem";
import { ugx } from "@/shared/format/ugx";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import type { CartLine } from "../../domain/cartLine";

export function ItemPicker({ item, onAdd }: { item: MenuItem; onAdd: (line: CartLine) => void }) {
  // The pick per group; a required group starts on its first choice.
  const [picks, setPicks] = useState<Record<string, string>>(Object.fromEntries(item.options.filter((g) => g.required).map((g) => [g.key, g.choices[0]?.key ?? ""])));
  const chosen = item.options.flatMap((g) => g.choices.filter((ch) => picks[g.key] === ch.key));
  const unitPrice = item.price + chosen.reduce((s, ch) => s + ch.priceDelta, 0);
  return (
    <li className="grid gap-2 border-b border-line p-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-subtitle font-bold">{item.name}</span>
        <span className="text-label">{ugx(unitPrice)}</span>
        {!item.available && <span className="text-caption text-error">Not available today</span>}
      </div>
      {item.description && <p className="text-caption text-muted">{item.description}</p>}
      {item.options.map((g) => (
        <SelectInput key={g.key} label={g.name} value={picks[g.key] ?? ""} onChange={(v) => setPicks({ ...picks, [g.key]: v })} options={[...(g.required ? [] : [["", "None"] as [string, string]]), ...g.choices.map((ch): [string, string] => [ch.key, `${ch.name}${ch.priceDelta ? ` (+${ugx(ch.priceDelta)})` : ""}`])]} />
      ))}
      <Button variant="secondary" disabled={!item.available} onClick={() => onAdd({ itemId: item.id, name: item.name, quantity: 1, unitPrice, options: Object.entries(picks).filter(([, v]) => v).map(([g, v]) => `${g}:${v}`) })}>Add</Button>
    </li>
  );
}
