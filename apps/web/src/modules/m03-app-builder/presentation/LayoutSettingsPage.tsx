"use client";
// S03-06 Public screens and S03-07 Client view settings: which modules guests
// can open before signing in, which roles may switch to the client view, and
// whether client view orders carry a TEST mark. Saved to the API; no code.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useLayoutSettings, useSaveLayoutSettings } from "../data/layoutApi";
import type { LayoutSettings } from "../domain/layoutSettings";

export function LayoutSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useLayoutSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={settings} name="Layout rules">{(s) => <SettingsForm initial={s} />}</LiveData>
      </div>
    </>
  );
}

function SettingsForm({ initial }: { initial: LayoutSettings }) {
  const save = useSaveLayoutSettings();
  const [s, setS] = useState(initial);
  const [roles, setRoles] = useState(initial.clientViewRoles.join(", "));
  const togglePublic = (slug: string, on: boolean) => setS({ ...s, publicModules: on ? [...s.publicModules, slug] : s.publicModules.filter((k) => k !== slug) });
  return (
    <>
      <SectionHeader title="Open before sign-in" />
      <div className="grid gap-1 sm:grid-cols-2">
        {catalog.modules.filter((m) => m.code !== "00").map((m) => (
          <SwitchRow key={m.slug} label={m.name} on={s.publicModules.includes(m.slug)} onChange={(on) => togglePublic(m.slug, on)} />
        ))}
      </div>
      <SectionHeader title="Client view" />
      <TextInput label="Roles that may switch to the client view (role keys, comma separated; * for every staff role)" value={roles} onChange={setRoles} />
      <SwitchRow label="Mark client view orders and bookings as TEST" on={s.markTestOrders} onChange={(markTestOrders) => setS({ ...s, markTestOrders })} />
      <div>
        <Button disabled={save.isPending} onClick={() => save.mutate({ ...s, clientViewRoles: roles.split(",").map((r) => r.trim()).filter(Boolean) })}>Save layout rules</Button>
      </div>
    </>
  );
}
