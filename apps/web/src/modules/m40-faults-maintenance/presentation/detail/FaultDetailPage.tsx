"use client";
// S40-04 Fault detail: the report, photos, history, likes and comments,
// with the steps the viewer may take (assign, start, fix, close, reopen).
// The API decides who may move it; refused steps come back as a toast.

import { useState } from "react";
import { useAssignFault, useCommentOnFault, useFault, useLikeFault, useMoveFault, type FaultStatus } from "@/modules/m40-faults-maintenance/data/faultsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PhotoStrip } from "@/shared/files/PhotoStrip";
import { dayTimeOf, words } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { CommentThread } from "@/shared/ui/social/CommentThread";
import { LikeButton } from "@/shared/ui/social/LikeButton";

/** The next steps offered from each status (the API checks who may take them). */
const STEPS: Record<FaultStatus, [FaultStatus, string][]> = {
  open: [["in_progress", "Start work"], ["cancelled", "Cancel"]],
  assigned: [["in_progress", "Start work"], ["fixed", "Mark fixed"], ["cancelled", "Cancel"]],
  in_progress: [["on_hold", "Put on hold"], ["fixed", "Mark fixed"]],
  on_hold: [["in_progress", "Resume"], ["fixed", "Mark fixed"]],
  fixed: [["closed", "Close"], ["in_progress", "Reopen"]],
  closed: [["in_progress", "Reopen"]],
  cancelled: [],
};

/** The detail page; the fault ID is the last part of the address. */
export function FaultDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const fault = useFault(id);
  const assign = useAssignFault(id);
  const move = useMoveFault(id);
  const like = useLikeFault();
  const comment = useCommentOnFault(id);
  const [staffId, setStaffId] = useState("");
  const [note, setNote] = useState("");
  return (
    <LiveData query={fault} name={screen.spec.name}>
      {(d) => (
        <div className="grid max-w-3xl gap-3 p-4">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title font-bold">{`${d.fault.number} · ${d.fault.title}`}</h2>
              <StatusChip status={words(d.fault.status)} />
            </div>
            <p className="text-caption text-muted">{[words(d.fault.priority), d.fault.location, d.fault.department, `Reported by ${d.fault.reportedBy.name}`, dayTimeOf(d.fault.createdAt)].filter(Boolean).join(" · ")}</p>
            {d.fault.description && <p className="mt-2 whitespace-pre-wrap text-body">{d.fault.description}</p>}
            <p className="mt-1 text-body">{d.fault.assignedTo ? `Assigned to ${d.fault.assignedTo.name}` : "Not assigned yet"}</p>
            {d.fault.fixNote && <p className="text-body">{`Fix: ${d.fault.fixNote}`}</p>}
            <div className="mt-2"><PhotoStrip ids={d.fault.photoIds} /></div>
            {d.settings.likesEnabled && <LikeButton likes={d.likes} onClick={() => like.mutate(id)} />}
          </Card>
          {STEPS[d.fault.status].length > 0 && (
            <>
              <SectionHeader title="Next step" />
              <div className="flex flex-wrap items-end gap-2">
                <StaffSelect label="Give it to" value={staffId} onChange={setStaffId} />
                <Button variant="secondary" disabled={!staffId || assign.isPending} onClick={() => assign.mutate(staffId)}>Assign</Button>
              </div>
              <TextInput label="Note (what was done, or why)" value={note} onChange={setNote} />
              <div className="flex flex-wrap gap-2">
                {STEPS[d.fault.status].map(([to, label]) => (
                  <Button key={to} variant={to === "cancelled" ? "danger" : "primary"} disabled={move.isPending} onClick={() => move.mutate({ status: to, note: note || null }, { onSuccess: () => setNote("") })}>{label}</Button>
                ))}
              </div>
            </>
          )}
          <SectionHeader title="History" />
          {d.events.map((e) => <p key={e.id} className="text-body">{`${dayTimeOf(e.at)} · ${e.byName}: ${e.from ? `${words(e.from)} → ` : ""}${words(e.to)}${e.note ? ` (${e.note})` : ""}`}</p>)}
          {d.settings.commentsEnabled && <CommentThread comments={d.comments} canComment sending={comment.isPending} onSend={(body, done) => comment.mutate(body, { onSuccess: done })} />}
        </div>
      )}
    </LiveData>
  );
}
