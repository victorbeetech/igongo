"use client";
// S62-16 Ordering settings: each order type on or off, for which outlets,
// and how it is paid (before, deposit or later); pre-order notice, deposit,
// cancel window and kitchen load. Saved to the API; no code changes.

import { useState } from "react";
import { useOrderingRules, useSaveOrderingRules } from "@/modules/m62-food-ordering/data/ordersApi";
import { TYPE_WORDS, type OrderType } from "@/modules/m62-food-ordering/domain/order";
import type { OrderingRules } from "@/modules/m62-food-ordering/domain/orderingRules";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

export function OrderingSettingsPage({ screen }: { screen: ScreenContext }) {
  const rules = useOrderingRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={rules} name="Ordering rules">{(r) => <RulesForm initial={r} />}</LiveData>
      </div>
    </>
  );
}

function RulesForm({ initial }: { initial: OrderingRules }) {
  const save = useSaveOrderingRules();
  const [r, setR] = useState(initial);
  const setType = (t: OrderType, patch: Partial<OrderingRules["types"][OrderType]>) => setR({ ...r, types: { ...r.types, [t]: { ...r.types[t], ...patch } } });
  const num = (k: "preorderMinNoticeMinutes" | "depositPercent" | "cancelWindowMinutes" | "minutesPerQueuedOrder" | "scheduleAheadDays" | "containerFee") => (v: string) => setR({ ...r, [k]: Number(v) || 0 });
  return (
    <>
      {(Object.keys(TYPE_WORDS) as OrderType[]).map((t) => (
        <section key={t} aria-label={TYPE_WORDS[t]} className="rounded-md border border-line bg-surface">
          <SwitchRow label={TYPE_WORDS[t]} on={r.types[t].enabled} onChange={(enabled) => setType(t, { enabled })} />
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            <SelectInput label="Paid" value={r.types[t].payment} onChange={(payment) => setType(t, { payment: payment as "before" | "deposit" | "later" })} options={[["before", "In full before cooking"], ["deposit", "Deposit before cooking"], ["later", "Later (at the table or on arrival)"]]} />
            <TextInput label="Only at outlets (comma separated; empty: all)" value={r.types[t].outlets.join(", ")} onChange={(v) => setType(t, { outlets: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
          </div>
        </section>
      ))}
      <div className="grid gap-2 sm:grid-cols-2">
        <TextInput label="Pre-order notice (minutes)" type="number" value={String(r.preorderMinNoticeMinutes)} onChange={num("preorderMinNoticeMinutes")} />
        <TextInput label="Deposit (%)" type="number" value={String(r.depositPercent)} onChange={num("depositPercent")} />
        <TextInput label="Guests may cancel within (minutes)" type="number" value={String(r.cancelWindowMinutes)} onChange={num("cancelWindowMinutes")} />
        <TextInput label="Minutes each queued order adds" type="number" value={String(r.minutesPerQueuedOrder)} onChange={num("minutesPerQueuedOrder")} />
        <TextInput label="Guests may schedule orders up to (days ahead; 0 turns it off)" type="number" value={String(r.scheduleAheadDays)} onChange={num("scheduleAheadDays")} />
        <TextInput label="Takeaway container fee (UGX; 0 gives containers free)" type="number" value={String(r.containerFee)} onChange={num("containerFee")} />
      </div>
      <Button onClick={() => save.mutate(r)} disabled={save.isPending}>Save ordering rules</Button>
    </>
  );
}
