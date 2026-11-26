"use client";
// S50-02 Chat room: the messages, oldest at the top, and a box to send.
// Opening it (and each new message) marks the chat read.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMarkRead, useMessages, useSend } from "@/modules/m50-chat/data/chatApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PhotoStrip } from "@/shared/files/PhotoStrip";
import { dayTimeOf } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { useMe } from "@/shared/session/useMe";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { chatName } from "../chats/ChatsPage";

/** The room; the chat ID is the last part of the address. */
export function ChatRoomPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const messages = useMessages(id);
  const send = useSend(id);
  const markRead = useMarkRead(id);
  const me = useMe().data?.account.id;
  const [text, setText] = useState("");
  const last = messages.data?.items.at(-1)?.id;
  const marked = useRef<string | undefined>(undefined);
  // Step 1: mark read once per newest message, not on every poll.
  useEffect(() => {
    if (last && marked.current !== last) {
      marked.current = last;
      markRead.mutate(undefined);
    }
  }, [last, markRead]);
  function submit(event: FormEvent) {
    event.preventDefault();
    send.mutate(text.trim(), { onSuccess: () => setText("") });
  }
  return (
    <LiveData query={messages} name={screen.spec.name}>
      {(d) => (
        <div className="grid max-w-3xl gap-3 p-4">
          <h2 className="text-title font-bold">{chatName({ title: d.conversation.title, members: d.members.filter((m) => m.userId !== me) })}</h2>
          <div className="grid gap-2" aria-live="polite">
            {d.items.length === 0 && <p className="text-caption text-muted">No messages yet. Say hello.</p>}
            {d.items.map((m) => (
              <div key={m.id} className={`max-w-[80%] rounded-md border border-line p-2 ${m.senderId === me ? "justify-self-end bg-surface-alt" : "justify-self-start bg-surface"}`}>
                <p className="text-caption text-muted">{`${m.senderName} · ${dayTimeOf(m.at)}`}</p>
                <p className="whitespace-pre-wrap text-body">{m.body}</p>
                <PhotoStrip ids={m.fileIds} />
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-end gap-2">
            <div className="flex-1"><TextInput label="Message" value={text} onChange={setText} autoComplete="off" /></div>
            <Button type="submit" disabled={!text.trim() || send.isPending}>Send</Button>
          </form>
        </div>
      )}
    </LiveData>
  );
}
