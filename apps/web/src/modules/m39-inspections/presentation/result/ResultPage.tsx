"use client";
// S39-03 Inspection result: the score, each line's answer and any fault it
// raised, with likes and comments from the people concerned.

import { useCommentOnRun, useLikeRun, useRun } from "@/modules/m39-inspections/data/inspectionsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PhotoStrip } from "@/shared/files/PhotoStrip";
import { dayTimeOf } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { CommentThread } from "@/shared/ui/social/CommentThread";
import { LikeButton } from "@/shared/ui/social/LikeButton";

/** The words for each answer. */
const ANSWER_WORDS = { ok: "OK", fault: "Fault", na: "N/A" } as const;

/** The result page; the run ID is the last part of the address. */
export function ResultPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const run = useRun(id);
  const like = useLikeRun();
  const comment = useCommentOnRun(id);
  return (
    <LiveData query={run} name={screen.spec.name}>
      {(d) => (
        <div className="grid max-w-3xl gap-3 p-4">
          <Card>
            <h2 className="text-title font-bold">{`${d.run.checklistName} · ${d.run.score}%`}</h2>
            <p className="text-caption text-muted">{`${d.run.department} · ${d.run.inspectorName} · ${dayTimeOf(d.run.submittedAt)} · ${d.run.faults} fault${d.run.faults === 1 ? "" : "s"}`}</p>
            {d.run.note && <p className="mt-1 text-body">{d.run.note}</p>}
            {d.settings.likesEnabled && <LikeButton likes={d.likes} onClick={() => like.mutate(id)} />}
          </Card>
          {d.run.results.map((r) => (
            <Card key={r.key}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-body font-bold">{r.label}</span>
                <StatusChip status={ANSWER_WORDS[r.result]} />
                {r.faultNumber && <span className="text-caption">{r.faultNumber}</span>}
              </div>
              {r.note && <p className="text-body">{r.note}</p>}
              <PhotoStrip ids={r.photoIds} />
            </Card>
          ))}
          {d.settings.commentsEnabled && <CommentThread comments={d.comments} canComment sending={comment.isPending} onSend={(body, done) => comment.mutate(body, { onSuccess: done })} />}
        </div>
      )}
    </LiveData>
  );
}
