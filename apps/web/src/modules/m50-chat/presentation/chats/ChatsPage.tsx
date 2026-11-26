"use client";
// S50-01 Chats: my conversations with unread counts, newest first. Guests
// also see the desks they can write to (front desk and so on).

import { useConversations, useDesks, useOpenDesk } from "@/modules/m50-chat/data/chatApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { ListRow } from "@/shared/ui/list-row/ListRow";

/** A chat's name: its title, the desk, or the other people in it. */
export const chatName = (c: { title: string | null; members: { name: string }[] }) => c.title ?? (c.members.map((m) => m.name).join(", ") || "Chat");

/** The list. */
export function ChatsPage({ screen }: { screen: ScreenContext }) {
  const chats = useConversations();
  const desks = useDesks();
  const open = useOpenDesk();
  const address = useAddress();
  const room = catalog.screen("S50-02")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {chats.data?.settings.staffChat && <Button href={catalog.hrefOf(catalog.screen("S50-03")!)}>New chat</Button>}
          {(desks.data?.items ?? []).map((d) => (
            <Button key={d.key} variant="secondary" disabled={open.isPending} onClick={() => open.mutate(d.key, { onSuccess: (c) => address.push(recordHref(room, c.id)) })}>{`Write to ${d.name}`}</Button>
          ))}
        </div>
        <LiveData query={chats} name="Chats" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <div className="grid gap-1">
              {d.items.map((c) => (
                <ListRow key={c.id} title={chatName(c)} subtitle={[c.lastPreview, c.lastMessageAt && dayTimeOf(c.lastMessageAt)].filter(Boolean).join(" · ")} status={c.unread ? `${c.unread} new` : undefined} href={recordHref(room, c.id)} />
              ))}
            </div>
          )}
        </LiveData>
      </div>
    </>
  );
}
