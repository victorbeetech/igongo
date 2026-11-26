"use client";
// S54-05 My account, S54-06 Edit my details and S54-07 Consent: the guest's
// own details (used by every order and booking), allergies and preferences
// the kitchen and front desk see, and the marketing choices, each off until
// the guest says yes.

import { useState } from "react";
import { useMyProfile, useSaveConsent, useSaveMyDetails } from "@/modules/m54-crm-guests/data/crmApi";
import type { GuestProfile } from "@/modules/m54-crm-guests/domain/guestProfile";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

export function MyAccountPage({ screen }: { screen: ScreenContext }) {
  const me = useMyProfile();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={me} name="Your account">{(p) => <AccountForm initial={p} />}</LiveData>
        <Card className="flex flex-wrap gap-2">
          <Button variant="secondary" href="/food-ordering/my-orders">My orders</Button>
          <Button variant="secondary" href="/room-bookings/my-bookings">My stays</Button>
          <Button variant="secondary" href="/museum/my-tickets">My tickets</Button>
          <Button variant="secondary" href="/payments/payments-list">My payments</Button>
        </Card>
      </div>
    </>
  );
}

function AccountForm({ initial }: { initial: GuestProfile }) {
  const save = useSaveMyDetails();
  const consent = useSaveConsent();
  const [v, setV] = useState({ name: initial.name, phone: initial.phone ?? "", nationality: initial.nationality ?? "", birthday: initial.birthday ?? "", preferences: initial.preferences ?? "", allergies: initial.allergies ?? "" });
  const [c, setC] = useState({ sms: initial.consent.sms, whatsapp: initial.consent.whatsapp, email: initial.consent.email });
  // Empty boxes clear the saved value.
  const orNull = (s: string) => (s.trim() ? s.trim() : null);
  return (
    <>
      <Card className="grid gap-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <TextInput label="Name" value={v.name} onChange={(name) => setV({ ...v, name })} />
          <TextInput label="Phone" type="tel" value={v.phone} onChange={(phone) => setV({ ...v, phone })} />
          <TextInput label="Nationality" value={v.nationality} onChange={(nationality) => setV({ ...v, nationality })} />
          <TextInput label="Birthday" type="date" value={v.birthday} onChange={(birthday) => setV({ ...v, birthday })} />
          <TextInput label="Preferences" value={v.preferences} onChange={(preferences) => setV({ ...v, preferences })} />
          <TextInput label="Allergies" value={v.allergies} onChange={(allergies) => setV({ ...v, allergies })} />
        </div>
        <Button disabled={save.isPending} onClick={() => save.mutate({ name: v.name, phone: orNull(v.phone), nationality: orNull(v.nationality), birthday: orNull(v.birthday), preferences: orNull(v.preferences), allergies: orNull(v.allergies) })}>Save my details</Button>
      </Card>
      <SectionHeader title="News and offers" />
      <Card>
        <SwitchRow label="By SMS" on={c.sms} onChange={(sms) => setC({ ...c, sms })} />
        <SwitchRow label="By WhatsApp" on={c.whatsapp} onChange={(whatsapp) => setC({ ...c, whatsapp })} />
        <SwitchRow label="By email" on={c.email} onChange={(email) => setC({ ...c, email })} />
        <Button disabled={consent.isPending} onClick={() => consent.mutate(c)}>Save my choices</Button>
      </Card>
    </>
  );
}
