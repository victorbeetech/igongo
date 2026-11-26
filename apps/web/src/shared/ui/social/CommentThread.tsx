"use client";
// Comments under a post, fault or checkup, with a box to add one. Shared by
// every module that lets people comment.

import { useState } from "react";
import { dayTimeOf } from "@/shared/format/when";
import { Button } from "@/shared/ui/button/Button";
import { TextArea } from "@/shared/ui/field/TextArea";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** One comment as the APIs return it. */
export interface ThreadComment {
  id: string;
  authorName: string;
  body: string;
  at: string;
}

interface CommentThreadProps {
  comments: ThreadComment[];
  /** False hides the box (no permission). */
  canComment: boolean;
  /** Sends a comment; resolves when saved. */
  onSend: (body: string, done: () => void) => void;
  sending: boolean;
}

/** The comments and the box. */
export function CommentThread({ comments, canComment, onSend, sending }: CommentThreadProps) {
  const [text, setText] = useState("");
  return (
    <div className="grid gap-2">
      <SectionHeader title={`Comments (${comments.length})`} />
      {comments.length === 0 && <p className="text-caption text-muted">No comments yet.</p>}
      {comments.map((c) => (
        <p key={c.id} className="text-body">
          <b>{c.authorName}</b> <span className="text-caption text-muted">{dayTimeOf(c.at)}</span>
          <br />
          {c.body}
        </p>
      ))}
      {canComment && (
        <>
          <TextArea label="Write a comment" value={text} onChange={setText} rows={2} />
          <div>
            <Button disabled={!text.trim() || sending} onClick={() => onSend(text.trim(), () => setText(""))}>Comment</Button>
          </div>
        </>
      )}
    </div>
  );
}
