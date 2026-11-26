"use client";
// S16-06 Card types and S16-07 Card type editor: each blank card's size,
// corners and print preset, and its chip settings: what is written, the
// password lock, the originality check and the tap counter.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useCardDesigns, useSaveCardDesigns } from "../../data/designsApi";
import type { CardDesigns } from "../../domain/cardDesigns";
import type { CardType } from "../../domain/cardType";

export function CardTypesPage({ screen }: { screen: ScreenContext }) {
  const designs = useCardDesigns();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={designs} name="Card types">{(d) => <Types initial={d} />}</LiveData>
      </div>
    </>
  );
}

function Types({ initial }: { initial: CardDesigns }) {
  const save = useSaveCardDesigns();
  const [d, setD] = useState(initial);
  const setType = (i: number, patch: Partial<CardType>) => setD({ ...d, types: d.types.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const add = () => {
    const base = d.types[0];
    if (base) setD({ ...d, types: [...d.types, { ...base, key: `type-${d.types.length + 1}`, name: "New card type", active: false }] });
  };
  return (
    <>
      {d.types.map((t, i) => (
        <section key={t.key} aria-label={t.name} className="grid gap-2 rounded-md border border-line bg-surface p-3 sm:grid-cols-2">
          <TextInput label="Name" value={t.name} onChange={(name) => setType(i, { name })} />
          <TextInput label="Chip" value={t.chip} onChange={(chip) => setType(i, { chip })} />
          <TextInput label="Width (mm)" type="number" value={String(t.widthMm)} onChange={(v) => setType(i, { widthMm: Number(v) || 0 })} />
          <TextInput label="Height (mm)" type="number" value={String(t.heightMm)} onChange={(v) => setType(i, { heightMm: Number(v) || 0 })} />
          <TextInput label="Corner radius (mm)" type="number" value={String(t.cornerMm)} onChange={(v) => setType(i, { cornerMm: Number(v) || 0 })} />
          <TextInput label="Printer preset" value={t.printPreset} onChange={(printPreset) => setType(i, { printPreset })} />
          <TextInput label="Written to the chip" value={t.write} onChange={(write) => setType(i, { write })} />
          <SwitchRow label="Lock the chip with a password" on={t.passwordLock} onChange={(passwordLock) => setType(i, { passwordLock })} />
          <SwitchRow label="Check the chip is genuine (originality)" on={t.originalityCheck} onChange={(originalityCheck) => setType(i, { originalityCheck })} />
          <SwitchRow label="Use the tap counter against copies" on={t.tapCounter} onChange={(tapCounter) => setType(i, { tapCounter })} />
          <SwitchRow label="In use" on={t.active} onChange={(active) => setType(i, { active })} />
        </section>
      ))}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={add}>Add card type</Button>
        <Button onClick={() => save.mutate(d)} disabled={save.isPending}>Save card types</Button>
      </div>
    </>
  );
}
