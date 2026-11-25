"use client";
// S49-02 Post detail: the whole post and its comments. Opening it marks it
// read (read receipts, S49-04). Commenting shows only when allowed.

import { useState } from "react";
import { useCommentOn, useNotice } from "@/modules/m49-notice-board/data/noticesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextArea } from "@/shared/ui/field/TextArea";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The post detail page; the post ID is the last part of the address. */
export function PostDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const post = useNotice(id);
  const comment = useCommentOn(id);
  const [text, setText] = useState("");
  return (
    <LiveData query={post} name={screen.spec.name}>
      {(d) => (
        <div className="grid max-w-2xl gap-3 p-4">
          <Card>
            <h2 className="text-title font-bold">{d.notice.title}</h2>
            <p className="text-caption text-muted">{d.notice.authorName} · {new Date(d.notice.createdAt).toLocaleString()} · {d.likes} likes</p>
            <p className="mt-2 whitespace-pre-wrap text-body">{d.notice.body}</p>
          </Card>
          {d.settings.commentsEnabled && d.notice.allowComments && (
            <>
              <SectionHeader title="Comments" />
              {d.comments.map((c) => <p key={c.id} className="text-body"><b>{c.authorName}:</b> {c.body}</p>)}
              <TextArea label="Write a comment" value={text} onChange={setText} rows={2} />
              <div><Button disabled={!text || comment.isPending} onClick={() => comment.mutate(text, { onSuccess: () => setText("") })}>Comment</Button></div>
            </>
          )}
        </div>
      )}
    </LiveData>
  );
}
