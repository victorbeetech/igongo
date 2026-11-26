"use client";
// S66-02 Delivery zones (and the module's settings): zones with fees and
// times, one per line, automatic or dispatcher assignment, proof of
// delivery, cash rules and pay per trip. A map editor follows with the
// Google Maps key.

import { useState } from "react";
import { useDeliveryRules, useSaveDeliveryRules } from "@/modules/m66-delivery-riders/data/deliveryApi";
import type { DeliveryRules } from "@/modules/m66-delivery-riders/domain/deliveryRules";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

export function ZonesPage({ screen }: { screen: ScreenContext }) {
  const rules = useDeliveryRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={rules} name="Delivery rules">{(r) => <RulesForm initial={r} />}</LiveData>
      </div>
    </>
  );
}

function RulesForm({ initial }: { initial: DeliveryRules }) {
  const save = useSaveDeliveryRules();
  const [r, setR] = useState(initial);
  const [zones, setZones] = useState(initial.zones.map((z) => `${z.zone}, ${z.name}, ${z.fee}, ${z.minutes}`).join("\n"));
  const submit = () => {
    const parsed = zones.split("\n").map((l) => l.split(",").map((x) => x.trim())).filter((p) => p[0] && p[1]).map((p) => ({ zone: p[0] ?? "", name: p[1] ?? "", fee: Number(p[2]) || 0, minutes: Number(p[3]) || 0 }));
    save.mutate({ ...r, zones: parsed });
  };
  return (
    <>
      <TextArea label="Zones, one per line: key, name, fee (UGX), minutes. Such as: kakoba, Kakoba, 5000, 25" value={zones} onChange={setZones} rows={6} />
      <div className="grid gap-2 sm:grid-cols-2">
        <SelectInput label="Assignment" value={r.assignment} onChange={(assignment) => setR({ ...r, assignment: assignment as DeliveryRules["assignment"] })} options={[["dispatcher", "A dispatcher assigns"], ["auto", "Automatic (least busy rider)"]]} />
        <SelectInput label="Proof of delivery" value={r.proof} onChange={(proof) => setR({ ...r, proof: proof as DeliveryRules["proof"] })} options={[["code", "The guest's 4-digit code"], ["none", "Rider confirms"]]} />
        <TextInput label="Cash limit per rider (UGX, 0 = none)" type="number" value={String(r.cashLimit)} onChange={(v) => setR({ ...r, cashLimit: Number(v) || 0 })} />
        <TextInput label="Rider pay per trip (UGX)" type="number" value={String(r.payPerTrip)} onChange={(v) => setR({ ...r, payPerTrip: Number(v) || 0 })} />
      </div>
      <SwitchRow label="Riders may collect cash" on={r.ridersCarryCash} onChange={(ridersCarryCash) => setR({ ...r, ridersCarryCash })} />
      <Button onClick={submit} disabled={save.isPending}>Save delivery rules</Button>
    </>
  );
}
