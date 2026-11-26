"use client";
// S30-06 Advance rules: switch advances and loans on or off, and set the
// most a person may ask for and the most months to repay.

import { useState } from "react";
import { useAdvanceRules, useSaveAdvanceRules, type AdvanceRules, type KindRule } from "@/modules/m30-advances-loans/data/advancesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The rules page. */
export function AdvanceRulesPage({ screen }: { screen: ScreenContext }) {
  const rules = useAdvanceRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name={screen.spec.name}>{(r) => <RulesForm key={JSON.stringify(r)} initial={r} />}</LiveData>
    </>
  );
}

/** One kind's three fields. */
function KindFields({ title, rule, onChange }: { title: string; rule: KindRule; onChange: (r: KindRule) => void }) {
  return (
    <>
      <SectionHeader title={title} />
      <SwitchRow label="Staff may ask" on={rule.enabled} onChange={(enabled) => onChange({ ...rule, enabled })} />
      <TextInput label="Most they may ask for (UGX, 0 for no limit)" type="number" value={String(rule.maxAmount)} onChange={(v) => onChange({ ...rule, maxAmount: Math.max(0, Math.round(Number(v) || 0)) })} />
      <TextInput label="Most months to repay" type="number" value={String(rule.maxInstalments)} onChange={(v) => onChange({ ...rule, maxInstalments: Math.min(60, Math.max(1, Math.round(Number(v) || 1))) })} />
    </>
  );
}

/** The form, saved together. */
function RulesForm({ initial }: { initial: AdvanceRules }) {
  const save = useSaveAdvanceRules();
  const [r, setR] = useState(initial);
  return (
    <div className="grid max-w-lg gap-3 p-4">
      <KindFields title="Salary advances" rule={r.advance} onChange={(advance) => setR({ ...r, advance })} />
      <KindFields title="Staff loans" rule={r.loan} onChange={(loan) => setR({ ...r, loan })} />
      <SwitchRow label="Only one open advance or loan at a time" on={r.oneOpenAtATime} onChange={(oneOpenAtATime) => setR({ ...r, oneOpenAtATime })} />
      <Button onClick={() => save.mutate(r)} disabled={save.isPending}>Save rules</Button>
    </div>
  );
}
