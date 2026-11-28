"use client";
// S57-05 Points rules (super admin): the programme's switch, the earn rate,
// the sign-up bonus, the minimum to spend, the value of a point and expiry.
// Saving changes what guests see at once, with no code change. The API checks
// every number, so a bad value is refused with its reason.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { type PointsRules, usePointsRules, useRunPointsExpiry, useSavePointsRules } from "../data/pointsApi";

/** The points rules page: loads the rules, then shows the form. */
export function PointsRulesPage({ screen }: { screen: ScreenContext }) {
  const rules = usePointsRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name={screen.spec.name}>
        {(saved) => <RulesForm initial={saved} />}
      </LiveData>
    </>
  );
}

/** The form. Numbers stay numbers; the switch is saved with the rest. */
function RulesForm({ initial }: { initial: PointsRules }) {
  const [values, setValues] = useState(initial);
  const save = useSavePointsRules();
  const expiry = useRunPointsExpiry();
  // One field change: the number from the text box, kept with the others.
  const setNumber = (key: Exclude<keyof PointsRules, "enabled">) => (text: string) => setValues({ ...values, [key]: Number(text) });

  return (
    <div className="grid gap-4 p-4">
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="Points programme" />
        <SwitchRow label="Points are on" hint="When off, guests see no points and nothing is earned or spent." on={values.enabled} onChange={(on) => setValues({ ...values, enabled: on })} />
      </section>
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="How guests earn and spend" />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Points per 1,000 UGX paid" type="number" value={String(values.pointsPer1000Ugx)} onChange={setNumber("pointsPer1000Ugx")} />
          <TextInput label="Sign-up bonus (points)" type="number" value={String(values.signupBonus)} onChange={setNumber("signupBonus")} />
          <TextInput label="Minimum to spend (points)" type="number" value={String(values.minimumToRedeem)} onChange={setNumber("minimumToRedeem")} />
          <TextInput label="UGX off for each point" type="number" value={String(values.ugxPerPoint)} onChange={setNumber("ugxPerPoint")} />
          <TextInput label="Days until points expire (0 = never)" type="number" value={String(values.expiryDays)} onChange={setNumber("expiryDays")} />
        </div>
        <Button onClick={() => save.mutate(values)} disabled={save.isPending}>
          Save points rules
        </Button>
      </section>
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="Expiry" />
        <p className="text-label">Expiry also runs on its own schedule. Use this to run it now.</p>
        <Button onClick={() => expiry.mutate()} disabled={expiry.isPending}>
          Run expiry now
        </Button>
      </section>
    </div>
  );
}
