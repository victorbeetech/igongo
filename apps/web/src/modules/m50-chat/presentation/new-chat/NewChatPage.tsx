"use client";
// S50-03 New chat: find staff by name, then open a one-to-one chat or make
// a group with the people ticked.

import { useState } from "react";
import { useConversations, usePeople, useStartChat } from "@/modules/m50-chat/data/chatApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The page. */
export function NewChatPage({ screen }: { screen: ScreenContext }) {
  const [q, setQ] = useState("");
  const people = usePeople(q);
  const chats = useConversations();
  const start = useStartChat();
  const address = useAddress();
  const [picked, setPicked] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const go = (c: { id: string }) => address.push(recordHref(catalog.screen("S50-02")!, c.id));
  const groups = chats.data?.settings.groups ?? false;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-lg gap-3 p-4">
        <TextInput label="Find someone" value={q} onChange={setQ} autoComplete="off" />
        <LiveData query={people} name="People" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <div className="grid gap-1">
              {d.items.map((p) => (
                <div key={p.userId} className="flex items-center justify-between gap-2">
                  {groups ? (
                    <SwitchRow label={`${p.name}${p.jobTitle ? ` · ${p.jobTitle}` : ""}`} on={picked.includes(p.userId)} onChange={(on) => setPicked(on ? [...picked, p.userId] : picked.filter((x) => x !== p.userId))} />
                  ) : (
                    <span className="text-body">{`${p.name}${p.jobTitle ? ` · ${p.jobTitle}` : ""}`}</span>
                  )}
                  <Button variant="text" disabled={start.isPending} onClick={() => start.mutate({ kind: "direct", userId: p.userId }, { onSuccess: go })}>Message</Button>
                </div>
              ))}
            </div>
          )}
        </LiveData>
        {groups && picked.length > 0 && (
          <>
            <TextInput label="Group name" value={title} onChange={setTitle} />
            <Button disabled={title.trim().length < 2 || start.isPending} onClick={() => start.mutate({ kind: "group", title: title.trim(), userIds: picked }, { onSuccess: go })}>{`Make group of ${picked.length + 1}`}</Button>
          </>
        )}
      </div>
    </>
  );
}
