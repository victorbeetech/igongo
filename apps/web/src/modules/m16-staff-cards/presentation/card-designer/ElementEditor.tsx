"use client";
// The settings of the picked element in the card designer: what it shows,
// its colour (brand colours only), size, font, weight and alignment, and
// its exact place. Changes show on the card at once.

import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { COLOURS, FIELD_WORDS, KIND_WORDS, LOGOS, type CardElement, type CardField } from "../../domain/cardElement";

interface ElementEditorProps {
  el: CardElement;
  onChange: (el: CardElement) => void;
  onRemove: () => void;
}

export function ElementEditor({ el, onChange, onRemove }: ElementEditorProps) {
  const set = (patch: Partial<CardElement>) => onChange({ ...el, ...patch });
  const num = (k: "x" | "y" | "w" | "h" | "size" | "radius") => (v: string) => set({ [k]: Number(v) || 0 });
  const words = el.kind === "field" || el.kind === "text";
  return (
    <section aria-label="Element settings" className="grid gap-2 rounded-md border border-line bg-surface p-3">
      <p className="text-label font-bold">{KIND_WORDS[el.kind]} “{el.id}”</p>
      {el.kind === "field" && <SelectInput label="Shows" value={el.field ?? "full_name"} onChange={(v) => set({ field: v as CardField })} options={Object.entries(FIELD_WORDS)} />}
      {el.kind === "text" && <TextInput label="Words" value={el.text ?? ""} onChange={(text) => set({ text })} />}
      {el.kind === "logo" && <SelectInput label="Logo" value={el.logo ?? "spiral"} onChange={(v) => set({ logo: v as CardElement["logo"] })} options={LOGOS.map((l): [string, string] => [l, l])} />}
      {el.kind !== "photo" && <SelectInput label="Colour" value={el.colour} onChange={(v) => set({ colour: v as CardElement["colour"] })} options={COLOURS.map((c): [string, string] => [c, c])} />}
      {words && (
        <div className="grid grid-cols-2 gap-2">
          <TextInput label="Text size" type="number" value={String(el.size)} onChange={num("size")} />
          <SelectInput label="Font" value={el.font} onChange={(v) => set({ font: v as CardElement["font"] })} options={[["brand", "Cinzel (brand)"], ["body", "Lato"]]} />
          <SelectInput label="Align" value={el.align} onChange={(v) => set({ align: v as CardElement["align"] })} options={[["start", "Left"], ["middle", "Centre"], ["end", "Right"]]} />
          <SwitchRow label="Bold" on={el.bold} onChange={(bold) => set({ bold })} />
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        <TextInput label="Left" type="number" value={String(el.x)} onChange={num("x")} />
        <TextInput label="Top" type="number" value={String(el.y)} onChange={num("y")} />
        <TextInput label="Width" type="number" value={String(el.w)} onChange={num("w")} />
        <TextInput label="Height" type="number" value={String(el.h)} onChange={num("h")} />
      </div>
      {(el.kind === "shape" || el.kind === "photo") && <TextInput label="Rounded corners" type="number" value={String(el.radius)} onChange={num("radius")} />}
      <div>
        <Button variant="secondary" onClick={onRemove}>Remove</Button>
      </div>
    </section>
  );
}
