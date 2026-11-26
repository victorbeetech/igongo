"use client";
// S31-05 Reward rules: cash and buffet on or off, approval, how long passes
// last, one pass a day, and the list of reasons.

import { useState } from "react";
import { useBonusRules, useSaveBonusRules, type BonusRules } from "@/modules/m31-bonuses-rewards/data/bonusesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The rules page. */
export function RewardRulesPage({ screen }: { screen: ScreenContext }) {
  const rules = useBonusRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name={screen.spec.name}>{(r) => <RulesForm key={JSON.stringify(r)} initial={r} />}</LiveData>
    </>
  );
}

/** The form, saved together; reasons are typed one per line. */
function RulesForm({ initial }: { initial: BonusRules }) {
  const save = useSaveBonusRules();
  const [r, setR] = useState(initial);
  const [reasons, setReasons] = useState(initial.reasons.join("\n"));
  return (
    <div className="grid max-w-lg gap-3 p-4">
      <SwitchRow label="Cash bonuses" on={r.cashEnabled} onChange={(cashEnabled) => setR({ ...r, cashEnabled })} />
      <SwitchRow label="Buffet passes" on={r.buffetEnabled} onChange={(buffetEnabled) => setR({ ...r, buffetEnabled })} />
      <SwitchRow label="A manager approves every reward" on={r.requireApproval} onChange={(requireApproval) => setR({ ...r, requireApproval })} />
      <SwitchRow label="At most one buffet pass a day" on={r.onePassPerDay} onChange={(onePassPerDay) => setR({ ...r, onePassPerDay })} />
      <TextInput label="Days a buffet pass lasts" type="number" value={String(r.buffetValidDays)} onChange={(v) => setR({ ...r, buffetValidDays: Math.min(366, Math.max(1, Math.round(Number(v) || 1))) })} />
      <TextArea label="Reasons to choose from (one per line)" value={reasons} onChange={setReasons} rows={4} />
      <Button disabled={save.isPending} onClick={() => save.mutate({ ...r, reasons: reasons.split("\n").map((x) => x.trim()).filter((x) => x.length >= 2) })}>Save rules</Button>
    </div>
  );
}
