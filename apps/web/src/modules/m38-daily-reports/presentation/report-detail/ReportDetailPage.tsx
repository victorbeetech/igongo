"use client";
// S38-06 Report detail: one report with its sections and comments; a
// supervisor signs it, or returns it with a note saying what to change.

import { useState } from "react";
import { REPORT_STATUS_WORDS, useComment, useReport, useReview } from "@/modules/m38-daily-reports/data/reportsApi";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextArea } from "@/shared/ui/field/TextArea";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The report detail page; the report ID is the last part of the address. */
export function ReportDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const report = useReport(id);
  const review = useReview(id);
  const comment = useComment(id);
  const [text, setText] = useState("");
  return (
    <LiveData query={report} name={screen.spec.name}>
      {({ report: r, staff, comments }) => (
        <div className="grid max-w-2xl gap-3 p-4">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title font-bold">{staffLine(staff)} · {r.workDate}</h2>
              <StatusChip status={REPORT_STATUS_WORDS[r.status]} />
            </div>
            {r.sections.map((s) => <div key={s.title} className="mt-2"><p className="text-label font-bold">{s.title}</p><p className="whitespace-pre-wrap text-body">{s.text || "—"}</p></div>)}
          </Card>
          <TextArea label="Comment, or what to change when returning" value={text} onChange={setText} rows={3} />
          <div className="flex flex-wrap gap-2">
            {r.status === "submitted" && <Button onClick={() => review.mutate({ decision: "signed" })}>Sign</Button>}
            {r.status === "submitted" && <Button variant="secondary" disabled={!text} onClick={() => review.mutate({ decision: "returned", note: text })}>Return with note</Button>}
            <Button variant="secondary" disabled={!text} onClick={() => comment.mutate(text, { onSuccess: () => setText("") })}>Comment</Button>
          </div>
          <SectionHeader title="Comments" />
          {comments.map((c) => <p key={c.id} className="text-body"><b>{c.authorName}:</b> {c.body}</p>)}
        </div>
      )}
    </LiveData>
  );
}
