"use client";
// S16-02 Card templates, S16-03 Card designer and S16-04 Template preview:
// pick a template (or copy one into a new design), drag and set its
// elements on the front and back with brand-only colours, fonts and logos,
// preview it with a real staff member's details or the long-name sample,
// print or download it, and save. No code changes.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { useActiveStaff } from "@/shared/staff/useActiveStaff";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useCardDesigns, useSaveCardDesigns } from "../../data/designsApi";
import { COLOURS, KIND_WORDS, type CardElement, type ElementKind } from "../../domain/cardElement";
import type { CardDesigns } from "../../domain/cardDesigns";
import type { CardTemplate } from "../../domain/cardTemplate";
import { CardCanvas } from "./CardCanvas";
import { CardPrint } from "./CardPrint";
import { ElementEditor } from "./ElementEditor";
import { holderOf } from "./holderOf";

export function CardDesignerPage({ screen }: { screen: ScreenContext }) {
  const designs = useCardDesigns();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={designs} name="Card designs">{(d) => <Designer initial={d} />}</LiveData>
      </div>
    </>
  );
}

/** A new element of [kind] in the middle of the card. */
const newElement = (kind: ElementKind, n: number): CardElement => ({
  id: `${kind}-${n}`, kind, x: 120, y: 300, w: 300, h: kind === "qr" || kind === "photo" || kind === "logo" ? 300 : 60,
  ...(kind === "field" ? { field: "full_name" as const } : {}), ...(kind === "text" ? { text: "Words" } : {}), ...(kind === "logo" ? { logo: "spiral" as const } : {}),
  colour: kind === "shape" ? "red" : "white", size: 32, font: "body", bold: false, align: "middle", radius: 0,
});

function Designer({ initial }: { initial: CardDesigns }) {
  const save = useSaveCardDesigns();
  const staff = useActiveStaff();
  const [d, setD] = useState(initial);
  const [key, setKey] = useState(initial.defaultTemplate);
  const [face, setFace] = useState<"front" | "back">("front");
  const [picked, setPicked] = useState("");
  const [person, setPerson] = useState("");
  const t = d.templates.find((x) => x.key === key) ?? d.templates[0];
  if (!t) return null;
  const side = t[face];
  const holder = holderOf(staff.data?.items.find((s) => s.staffId === person));

  // Changes to the open template and side.
  const setT = (next: CardTemplate) => setD({ ...d, templates: d.templates.map((x) => (x.key === t.key ? next : x)) });
  const setEls = (elements: CardElement[]) => setT({ ...t, [face]: { ...side, elements } });
  const setEl = (el: CardElement) => setEls(side.elements.map((e) => (e.id === el.id ? el : e)));
  const add = (kind: ElementKind) => {
    const el = newElement(kind, side.elements.length + 1);
    setEls([...side.elements, el]);
    setPicked(el.id);
  };
  const copy = () => {
    const n = d.templates.length + 1;
    const clone = { ...structuredClone(t), key: `design-${n}`, name: `${t.name} copy` };
    setD({ ...d, templates: [...d.templates, clone] });
    setKey(clone.key);
  };
  const el = side.elements.find((e) => e.id === picked);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid content-start gap-3">
        {/* S16-02: the templates, and the one open. */}
        <div className="flex flex-wrap items-end gap-2">
          <SelectInput label="Template" value={t.key} onChange={(v) => { setKey(v); setPicked(""); }} options={d.templates.map((x): [string, string] => [x.key, `${x.name}${x.key === d.defaultTemplate ? " (default)" : ""}${x.active ? "" : " (off)"}`])} />
          <Button variant="secondary" onClick={copy}>Copy as new design</Button>
          <Button variant="secondary" onClick={() => setFace(face === "front" ? "back" : "front")}>Show {face === "front" ? "back" : "front"}</Button>
        </div>
        {/* S16-03 and S16-04: the card, live, with a real person or the long-name sample. */}
        <div className="flex justify-center rounded-md bg-surface-alt p-4">
          <CardCanvas template={t} side={side} holder={holder} width={t.orientation === "portrait" ? 300 : 440} selected={picked} onSelect={setPicked} onMove={(id, x, y) => { const e = side.elements.find((v) => v.id === id); if (e) setEl({ ...e, x, y }); }} />
        </div>
        <StaffSelect label="Preview with (empty: long-name sample)" value={person} onChange={setPerson} />
        <CardPrint template={t} type={d.types.find((x) => x.key === t.cardType)} holder={holder} />
      </div>
      <div className="grid content-start gap-3">
        <TextInput label="Template name" value={t.name} onChange={(name) => setT({ ...t, name })} />
        <SelectInput label="Card shape" value={t.orientation} onChange={(v) => setT({ ...t, orientation: v as CardTemplate["orientation"] })} options={[["portrait", "Portrait"], ["landscape", "Landscape"]]} />
        <SelectInput label="Card type" value={t.cardType} onChange={(cardType) => setT({ ...t, cardType })} options={d.types.map((x): [string, string] => [x.key, x.name])} />
        <SelectInput label={`${face === "front" ? "Front" : "Back"} background`} value={side.background} onChange={(v) => setT({ ...t, [face]: { ...side, background: v as CardTemplate["front"]["background"] } })} options={COLOURS.map((c): [string, string] => [c, c])} />
        <SwitchRow label="Switched on" on={t.active} onChange={(active) => setT({ ...t, active })} />
        <SwitchRow label="Default for every role" on={d.defaultTemplate === t.key} onChange={(on) => on && setD({ ...d, defaultTemplate: t.key })} />
        <div className="flex flex-wrap gap-1">
          {(Object.keys(KIND_WORDS) as ElementKind[]).map((k) => <Button key={k} variant="secondary" onClick={() => add(k)}>+ {KIND_WORDS[k]}</Button>)}
        </div>
        {el ? <ElementEditor el={el} onChange={setEl} onRemove={() => { setEls(side.elements.filter((e) => e.id !== el.id)); setPicked(""); }} /> : <p className="text-caption text-muted">Tap an element on the card to change it, or drag it to move it.</p>}
        <Button onClick={() => save.mutate(d)} disabled={save.isPending}>Save card designs</Button>
      </div>
    </div>
  );
}
