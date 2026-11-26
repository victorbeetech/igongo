"use client";
// S50-05 Chat settings: staff chat, groups and guest chat on or off, the
// desks guests can write to (and which roles answer them), attachments and
// the largest group.

import { useState } from "react";
import { useChatSettings, useSaveChatSettings, type ChatSettings } from "@/modules/m50-chat/data/chatApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The settings page. */
export function ChatSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useChatSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
    </>
  );
}

/** A key from words, such as "Front desk" → "front-desk". */
const keyOf = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** The form, saved together. Desk roles are typed as role keys with commas. */
function SettingsForm({ initial }: { initial: ChatSettings }) {
  const save = useSaveChatSettings();
  const [s, setS] = useState(initial);
  const [roles, setRoles] = useState(initial.desks.map((d) => d.roles.join(", ")));
  const setDesk = (i: number, change: Partial<ChatSettings["desks"][number]>) => setS({ ...s, desks: s.desks.map((d, j) => (j === i ? { ...d, ...change } : d)) });
  return (
    <div className="grid max-w-lg gap-3 p-4">
      <SwitchRow label="Staff can chat with each other" on={s.staffChat} onChange={(staffChat) => setS({ ...s, staffChat })} />
      <SwitchRow label="Group chats" on={s.groups} onChange={(groups) => setS({ ...s, groups })} />
      <SwitchRow label="Guests can write to the desks" on={s.guestChat} onChange={(guestChat) => setS({ ...s, guestChat })} />
      <SwitchRow label="Photos in chats" on={s.attachments} onChange={(attachments) => setS({ ...s, attachments })} />
      <TextInput label="Largest group" type="number" value={String(s.maxGroupSize)} onChange={(v) => setS({ ...s, maxGroupSize: Math.min(500, Math.max(2, Math.round(Number(v) || 2))) })} />
      <SectionHeader title="Desks" />
      {s.desks.map((d, i) => (
        <div key={i} className="grid gap-2 rounded-md border border-line p-2">
          <TextInput label="Desk name" value={d.name} onChange={(name) => setDesk(i, { name, key: d.key || keyOf(name) })} />
          <TextInput label="Roles that answer (role keys, commas)" value={roles[i] ?? ""} onChange={(v) => { setRoles(roles.map((r, j) => (j === i ? v : r))); setDesk(i, { roles: v.split(",").map((r) => keyOf(r)).filter((r) => r.length >= 2) }); }} />
          <div><Button variant="text" onClick={() => { setS({ ...s, desks: s.desks.filter((_, j) => j !== i) }); setRoles(roles.filter((_, j) => j !== i)); }}>Remove desk</Button></div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => { setS({ ...s, desks: [...s.desks, { key: "", name: "", roles: [] }] }); setRoles([...roles, ""]); }}>Add desk</Button>
        <Button disabled={save.isPending} onClick={() => save.mutate({ ...s, desks: s.desks.map((d) => ({ ...d, key: d.key || keyOf(d.name) })).filter((d) => d.key.length >= 2 && d.name.trim().length >= 2) })}>Save settings</Button>
      </div>
    </div>
  );
}
