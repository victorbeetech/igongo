"use client";
// S38-01 My daily report (and S38-02 Fill daily report): today's report from
// the super admin's template. Save a draft any time; send it for sign-off
// when done. Returned reports show the supervisor's note and open again.

import { useState } from "react";
import { REPORT_STATUS_WORDS, useMyReport, useSaveMyReport, type ReportComment, type ReportSection } from "@/modules/m38-daily-reports/data/reportsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextArea } from "@/shared/ui/field/TextArea";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** My report for today. */
export function MyReportPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyReport("");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={mine} name={screen.spec.name}>
        {(d) => {
          // Start from the saved answers, or the template's empty sections.
          const sections = d.report?.sections ?? d.template.sections.map((title) => ({ title, text: "" }));
          return <ReportForm key={d.report?.id ?? "new"} date={d.date} status={d.report?.status ?? null} note={d.report?.reviewNote ?? null} initial={sections} comments={d.comments} dueBy={d.template.dueBy} />;
        }}
      </LiveData>
    </>
  );
}

interface FormProps {
  date: string;
  status: keyof typeof REPORT_STATUS_WORDS | null;
  note: string | null;
  initial: ReportSection[];
  comments: ReportComment[];
  dueBy: string;
}

/** The report form, locked once sent. */
function ReportForm({ date, status, note, initial, comments, dueBy }: FormProps) {
  const save = useSaveMyReport();
  const [sections, setSections] = useState(initial);
  const locked = status === "submitted" || status === "signed";
  const send = (submit: boolean) => save.mutate({ date, sections, submit });
  return (
    <div className="grid max-w-2xl gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-label font-bold">Report for {date} · due by {dueBy}</p>
        {status && <StatusChip status={REPORT_STATUS_WORDS[status]} />}
      </div>
      {status === "returned" && note && <p className="text-body text-warning">Returned: {note}</p>}
      {sections.map((s, i) => (
        <TextArea key={s.title} label={s.title} value={s.text} onChange={(text) => setSections(sections.map((x, j) => (j === i ? { ...x, text } : x)))} />
      ))}
      {!locked && (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => send(false)} disabled={save.isPending}>Save draft</Button>
          <Button onClick={() => send(true)} disabled={save.isPending}>Send for sign-off</Button>
        </div>
      )}
      {comments.length > 0 && <SectionHeader title="Comments" />}
      {comments.map((c) => <p key={c.id} className="text-body"><b>{c.authorName}:</b> {c.body}</p>)}
    </div>
  );
}
