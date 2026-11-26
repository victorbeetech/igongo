"use client";
// S77-06 Payment methods: every way to pay, each with its switch for the
// whole system, saved to the API. Gateway methods link to Connection
// settings, where the super admin pastes their keys; going live needs keys
// only, never code. Sandbox or live is chosen here too.

import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useConnections, useMethodSettings, useSaveMethodSettings } from "@/modules/m77-payments/data/paymentsApi";
import { METHOD_NAMES, type MethodSettings } from "@/modules/m77-payments/domain/methodInfo";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

// The Connection settings page (module 14) by its address, not its code: modules never import each other.
const CONNECTION_SETTINGS = "/integrations-hub/connection-settings";

export function PaymentMethodsPage({ screen }: { screen: ScreenContext }) {
  const settings = useMethodSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={settings} name="Payment methods">{(s) => <MethodsForm initial={s} />}</LiveData>
      </div>
    </>
  );
}

/** The switches, saved together. */
function MethodsForm({ initial }: { initial: MethodSettings }) {
  const save = useSaveMethodSettings();
  const connections = useConnections();
  const [s, setS] = useState(initial);
  const set = (method: string, patch: Partial<MethodSettings["methods"][string]>) => {
    const current = s.methods[method] ?? { enabled: false, outlets: [], modules: [] };
    setS({ ...s, methods: { ...s.methods, [method]: { ...current, ...patch } } });
  };
  const list = (text: string) => text.split(",").map((x) => x.trim()).filter(Boolean);
  return (
    <>
      <SelectInput label="Providers" value={s.environment} onChange={(environment) => setS({ ...s, environment: environment as MethodSettings["environment"] })} options={[["sandbox", "Sandbox (testing)"], ["live", "Live (real money)"]]} />
      <SwitchRow label="Staff may record payments by hand" on={s.allowManual} onChange={(allowManual) => setS({ ...s, allowManual })} />
      <SwitchRow label="Preview mode: show gateways without keys, greyed out, on pay screens" hint="Turn off before the App Store release" on={s.showPreview} onChange={(showPreview) => setS({ ...s, showPreview })} />
      {Object.entries(METHOD_NAMES).map(([method, info]) => {
        const m = s.methods[method] ?? { enabled: false, outlets: [], modules: [] };
        return (
          <section key={method} aria-label={info.name} className="rounded-md border border-line bg-surface">
            <SwitchRow label={info.name} hint={m.enabled ? "On" : "Off"} on={m.enabled} onChange={(enabled) => set(method, { enabled })} />
            <div className="grid gap-2 p-3 sm:grid-cols-2">
              <TextInput label="Only at outlets (keys, comma separated; empty: all)" value={m.outlets.join(", ")} onChange={(t) => set(method, { outlets: list(t) })} />
              <TextInput label="Only for modules (empty: all)" value={m.modules.join(", ")} onChange={(t) => set(method, { modules: list(t) })} />
            </div>
            {info.provider && (
              <div className="flex items-center gap-2 px-3 pb-3">
                <StatusChip status={connections.data?.[method] ? "Connected" : "Preview: no keys yet"} />
                <Button variant="text" href={`${CONNECTION_SETTINGS}?provider=${info.provider}`} icon={<KeyRound size={16} aria-hidden />}>Add keys</Button>
              </div>
            )}
          </section>
        );
      })}
      <Button onClick={() => save.mutate(s)} disabled={save.isPending}>Save payment methods</Button>
    </>
  );
}
