"use client";
// S10-04 Broadcast, on the web: the super admin writes an update and picks the
// roles it goes to. Each person gets it in the Updates inbox and on their phones.
// Live from the API; nothing is kept on the page after it is posted.

import { useState } from "react";
import { parseRoles, usePostUpdate, type PostChannel } from "../../data/broadcastApi";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";

/** Labels for the channels, in the order the select shows them. */
const CHANNEL_LABELS: [string, string][] = [
  ["general", "General"],
  ["work", "Work"],
  ["messages", "Messages"],
  ["bookings", "Bookings"],
  ["urgent", "Urgent"],
];

/** The form to post an update to people holding chosen roles. */
export function PostUpdatePage({ screen }: { screen: ScreenContext }) {
  // Step 1: the form's fields, all kept here until the post is sent.
  const [roles, setRoles] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<PostChannel>("general");
  const [link, setLink] = useState("");
  const post = usePostUpdate();

  // Step 2: a post needs at least one role and a title and text.
  const roleList = parseRoles(roles);
  const ready = roleList.length > 0 && title.trim().length > 0 && body.trim().length > 0;

  // Step 3: send, then clear the words so the same post is not sent twice by accident.
  const send = () =>
    post.mutate(
      { roles: roleList, title: title.trim(), body: body.trim(), channel, link: link.trim() || null },
      { onSuccess: () => { setTitle(""); setBody(""); setLink(""); } },
    );

  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <form
        className="grid gap-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready && !post.isPending) send();
        }}
      >
        <TextInput
          label="Roles to tell"
          value={roles}
          onChange={setRoles}
          hint="Role keys separated by commas, such as receptionist, hr-manager"
          required
        />
        <TextInput label="Title" value={title} onChange={setTitle} required />
        <TextArea label="Message" value={body} onChange={setBody} rows={4} required />
        <SelectInput label="Channel" value={channel} onChange={(v) => setChannel(v as PostChannel)} options={CHANNEL_LABELS} />
        <TextInput label="Opens (optional app link)" value={link} onChange={setLink} hint="For example /orders/ord_1" />
        <p className="text-caption text-muted">
          Each person gets this in their Updates inbox and on their phones. Pushes wait until Firebase is set up.
        </p>
        <div>
          <Button type="submit" disabled={!ready || post.isPending}>
            {post.isPending ? "Posting…" : "Post update"}
          </Button>
        </div>
      </form>
    </>
  );
}
