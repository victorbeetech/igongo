"use client";
// One record opened: its fields, status, who it is for and with, the QR
// code text, the next steps (any other status of its type), assign,
// comments and the full history. The API decides who may take each step;
// a refused step comes back as a toast.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import { dayTimeOf } from "@/shared/format/when";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { useAssignRecord, useCommentOnRecord, useMoveRecord, useRecord } from "../data/recordsApi";
import type { RecordConfig } from "../types/recordConfig";
import type { RecordPlace } from "../types/recordPlace";
import { FieldText } from "./FieldText";
import { statusLabel } from "./recordWords";

interface RecordDetailProps {
  place: RecordPlace;
  config: RecordConfig;
  id: string;
  /** Shows the staff steps (move, assign). The API still checks. */
  staff?: boolean;
  onClose?: () => void;
}

export function RecordDetail({ place, config, id, staff, onClose }: RecordDetailProps) {
  const record = useRecord(place, id);
  const move = useMoveRecord(place, id);
  const assign = useAssignRecord(place, id);
  const comment = useCommentOnRecord(place, id);
  const [note, setNote] = useState("");
  const [text, setText] = useState("");
  const [staffId, setStaffId] = useState("");
  return (
    <LiveData query={record} name="This record">
      {({ record: r, events }) => {
        const type = config.types.find((t) => t.key === r.type);
        const next = (type?.statuses ?? []).filter((s) => s.key !== r.status);
        return (
          <div className="grid gap-3">
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-title font-bold">{`${r.code} · ${r.title}`}</h2>
                <StatusChip status={statusLabel(type, r.status)} />
                {onClose && <Button variant="text" onClick={onClose}>Close</Button>}
              </div>
              <p className="text-caption text-muted">
                {[type?.name, `For ${r.ownerName}`, r.assigneeName && `With ${r.assigneeName}`, r.dueOn, r.location, dayTimeOf(r.createdAt)].filter(Boolean).join(" · ")}
              </p>
              <dl className="mt-2 grid gap-1 sm:grid-cols-2">
                {(type?.fields ?? []).map((f) => (
                  <div key={f.key}>
                    <dt className="text-caption text-muted">{f.label}</dt>
                    <dd className="text-body"><FieldText field={f} value={r.fields[f.key]} /></dd>
                  </div>
                ))}
              </dl>
              {r.qr && <p className="mt-2 text-caption text-muted">{`QR: ${r.qr}`}</p>}
            </Card>
            {staff && next.length > 0 && (
              <>
                <SectionHeader title="Next step" />
                <TextInput label="Note (optional)" value={note} onChange={setNote} />
                <div className="flex flex-wrap gap-2">
                  {next.map((s) => (
                    <Button key={s.key} variant={s.done ? "secondary" : "primary"} disabled={move.isPending} onClick={() => move.mutate({ status: s.key, ...(note ? { note } : {}) }, { onSuccess: () => setNote("") })}>{s.label}</Button>
                  ))}
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <StaffSelect label="Give it to" value={staffId} onChange={setStaffId} />
                  <Button variant="secondary" disabled={!staffId || assign.isPending} onClick={() => assign.mutate(staffId)}>Assign</Button>
                </div>
              </>
            )}
            <SectionHeader title="History" />
            {events.map((e) => <p key={e.id} className="text-body">{`${dayTimeOf(e.at)} · ${e.byName}: ${e.text}`}</p>)}
            {config.comments && (
              <div className="flex flex-wrap items-end gap-2">
                <TextInput label="Add a comment" value={text} onChange={setText} />
                <Button disabled={!text.trim() || comment.isPending} onClick={() => comment.mutate(text, { onSuccess: () => setText("") })}>Send</Button>
              </div>
            )}
          </div>
        );
      }}
    </LiveData>
  );
}
