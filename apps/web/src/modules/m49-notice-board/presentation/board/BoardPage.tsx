"use client";
// S49-01 Notice board: posts for me, pinned first, with likes, comment
// counts and an unread mark. Buttons show only when my role and the board's
// switches allow them.

import { Heart, MessageSquare, Pin } from "lucide-react";
import { useBoard, useLike } from "@/modules/m49-notice-board/data/noticesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";

/** The notice board. */
export function BoardPage({ screen }: { screen: ScreenContext }) {
  const board = useBoard();
  const like = useLike();
  const detail = catalog.screen("S49-02")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={board} name="Posts" isEmpty={(d) => d.items.length === 0}>
        {(d) => (
          <div className="grid gap-3 p-4">
            {d.can.post && <div><Button href={catalog.hrefOf(catalog.screen("S49-03")!)}>New post</Button></div>}
            {d.items.map((n) => (
              <Card key={n.id}>
                <div className="flex flex-wrap items-center gap-2">
                  {n.pinned && <Pin size={16} aria-label="Pinned" />}
                  <a href={recordHref(detail, n.id)} className="text-title font-bold text-primary-text">{n.title}</a>
                  {!n.readByMe && <StatusChip status="New" />}
                </div>
                <p className="text-caption text-muted">{n.authorName} · {new Date(n.createdAt).toLocaleString()}</p>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-body">{n.body}</p>
                <div className="mt-2 flex items-center gap-3 text-caption">
                  {d.settings.likesEnabled && n.allowLikes && (
                    <Button variant="text" icon={<Heart size={16} aria-hidden fill={n.likedByMe ? "currentColor" : "none"} />} onClick={() => like.mutate(n.id)} disabled={!d.can.like}>{`${n.likes} like${n.likes === 1 ? "" : "s"}`}</Button>
                  )}
                  {d.settings.commentsEnabled && n.allowComments && <span className="inline-flex items-center gap-1"><MessageSquare size={16} aria-hidden />{n.comments}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </LiveData>
    </>
  );
}
