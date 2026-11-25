"use client";
// S49-03 New post (and S49-05 Board settings): write a post for all staff
// or chosen roles, pin it, and choose whether it takes likes and comments.
// The board settings switch likes, comments and read receipts off for all.

import { useState, type FormEvent } from "react";
import { useBoardSettings, usePublish, useSaveBoardSettings, type BoardSettings } from "@/modules/m49-notice-board/data/noticesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** S49-03: the new post form. */
export function NewPostPage({ screen }: { screen: ScreenContext }) {
  const address = useAddress();
  const publish = usePublish();
  const [post, setPost] = useState({ title: "", body: "", roles: "", pinned: false, allowComments: true, allowLikes: true });
  function submit(event: FormEvent) {
    event.preventDefault();
    // Roles are typed as keys separated by commas, such as "gatekeeper, receptionist".
    const audienceRoles = post.roles.split(",").map((r) => r.trim()).filter(Boolean);
    publish.mutate({ title: post.title, body: post.body, audienceRoles, pinned: post.pinned, allowComments: post.allowComments, allowLikes: post.allowLikes }, { onSuccess: () => address.push(catalog.hrefOf(catalog.screen("S49-01")!)) });
  }
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <form onSubmit={submit} className="grid max-w-2xl gap-3 p-4">
        <TextInput label="Title" value={post.title} onChange={(title) => setPost({ ...post, title })} required />
        <TextArea label="Message" value={post.body} onChange={(body) => setPost({ ...post, body })} rows={6} required />
        <TextInput label="Only for these role keys (empty for all staff)" value={post.roles} onChange={(roles) => setPost({ ...post, roles })} hint="Such as gatekeeper, receptionist" />
        <SwitchRow label="Pin to the top" on={post.pinned} onChange={(pinned) => setPost({ ...post, pinned })} />
        <SwitchRow label="Allow comments" on={post.allowComments} onChange={(allowComments) => setPost({ ...post, allowComments })} />
        <SwitchRow label="Allow likes" on={post.allowLikes} onChange={(allowLikes) => setPost({ ...post, allowLikes })} />
        <Button type="submit" disabled={publish.isPending}>Post to the board</Button>
      </form>
    </>
  );
}

/** S49-05: board-wide switches. */
export function BoardSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useBoardSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
    </>
  );
}

/** The switches, saved together. */
function SettingsForm({ initial }: { initial: BoardSettings }) {
  const save = useSaveBoardSettings();
  const [s, setS] = useState(initial);
  return (
    <div className="grid max-w-lg gap-3 p-4">
      <SwitchRow label="Comments on posts" on={s.commentsEnabled} onChange={(commentsEnabled) => setS({ ...s, commentsEnabled })} />
      <SwitchRow label="Likes on posts" on={s.likesEnabled} onChange={(likesEnabled) => setS({ ...s, likesEnabled })} />
      <SwitchRow label="Read receipts for authors" on={s.readReceipts} onChange={(readReceipts) => setS({ ...s, readReceipts })} />
      <Button onClick={() => save.mutate(s)} disabled={save.isPending}>Save settings</Button>
    </div>
  );
}
