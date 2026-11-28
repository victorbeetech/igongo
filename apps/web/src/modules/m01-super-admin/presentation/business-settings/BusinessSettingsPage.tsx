"use client";
// S01-06 Business settings (also S01-05 Hotel profile and S01-11 Global
// banner): the hotel's details, branding and regional formats, each section
// saved on its own. The API checks every value before saving.

import { useState } from "react";
import { useSaveSection, useSettings } from "@/modules/m01-super-admin/data/consoleApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** Readable names for each section. */
const TITLES: Record<string, string> = { hotel: "Hotel profile", branding: "Branding and banner", regional: "Time, money and formats" };

/** The settings page. */
export function BusinessSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>
        {(d) => <div className="grid gap-4 p-4">{Object.entries(d).map(([name, values]) => <SectionForm key={name} name={name} initial={values} />)}</div>}
      </LiveData>
    </>
  );
}

/** One section's fields and its Save button. Numbers stay numbers. */
function SectionForm({ name, initial }: { name: string; initial: Record<string, unknown> }) {
  const [values, setValues] = useState(initial);
  const save = useSaveSection();
  const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  return (
    <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
      <SectionHeader title={TITLES[name] ?? name} />
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(values).map(([key, value]) =>
          // A true/false setting (such as the Contact Us switch) gets a switch; everything else a text box.
          typeof initial[key] === "boolean" ? (
            <SwitchRow key={key} label={label(key)} on={Boolean(value)} onChange={(on) => setValues({ ...values, [key]: on })} />
          ) : (
            <TextInput key={key} label={label(key)} value={String(value ?? "")} onChange={(v) => setValues({ ...values, [key]: typeof initial[key] === "number" ? Number(v) : v })} />
          ),
        )}
      </div>
      <Button onClick={() => save.mutate({ section: name, values })} disabled={save.isPending}>Save {TITLES[name]?.toLowerCase() ?? name}</Button>
    </section>
  );
}
