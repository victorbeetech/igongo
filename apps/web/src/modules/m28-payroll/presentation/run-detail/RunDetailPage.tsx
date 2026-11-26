"use client";
// S28-03 Pay run detail (with S28-04 review and S28-08 file): the totals,
// every payslip, manual adjustments while it is a draft, and the steps:
// recalculate, approve (a second person), mark paid, cancel, download.

import { useState } from "react";
import { useAdjust, useRun, useRunStep, type Payslip } from "@/modules/m28-payroll/data/payrollApi";
import { linesToText, textToLines } from "@/modules/m28-payroll/domain/payLines";
import { downloadFile } from "@/shared/api/downloadFile";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextArea } from "@/shared/ui/field/TextArea";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The detail page; the run ID is the last part of the address. */
export function RunDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const run = useRun(id);
  const step = useRunStep(id);
  const [adjusting, setAdjusting] = useState<Payslip | null>(null);
  return (
    <LiveData query={run} name={screen.spec.name}>
      {(d) => (
        <div className="grid gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-title font-bold">{`Pay run ${d.run.period}`}</h2>
            <StatusChip status={words(d.run.status)} />
          </div>
          <p className="text-caption text-muted">{[`Started by ${d.run.createdByName}`, d.run.approvedByName && `approved by ${d.run.approvedByName}`, d.run.paidByName && `paid by ${d.run.paidByName}`].filter(Boolean).join(" · ")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <KpiCard label="Gross" value={ugx(d.run.gross)} />
            <KpiCard label="Deductions" value={ugx(d.run.deductions)} />
            <KpiCard label="Net to pay" value={ugx(d.run.net)} />
            <KpiCard label="Employer cost" value={ugx(d.run.employerCost)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {d.run.status === "draft" && <Button variant="secondary" disabled={step.isPending} onClick={() => step.mutate("recalculate")}>Recalculate</Button>}
            {d.run.status === "draft" && <Button disabled={step.isPending} onClick={() => step.mutate("approve")}>Approve</Button>}
            {d.run.status === "approved" && <Button disabled={step.isPending} onClick={() => step.mutate("paid")}>Mark paid</Button>}
            {(d.run.status === "draft" || d.run.status === "approved") && <Button variant="danger" disabled={step.isPending} onClick={() => step.mutate("cancel")}>Cancel run</Button>}
            <Button variant="secondary" onClick={() => void downloadFile(`/api/payroll/runs/${id}/export.csv`, `payroll-${d.run.period}.csv`)}>Download spreadsheet</Button>
          </div>
          {adjusting && <AdjustForm key={adjusting.id} slip={adjusting} close={() => setAdjusting(null)} />}
          <DataTable
            rows={d.payslips}
            rowKey={(p) => p.id}
            columns={[
              { label: "Staff", cell: (p) => `${p.staffName} · ${p.staffNumber}` },
              { label: "Gross", cell: (p) => ugx(p.gross) },
              { label: "Deductions", cell: (p) => <span title={p.deductions.map((l) => `${l.name}: ${ugx(l.amount)}`).join("\n")}>{ugx(p.totalDeductions)}</span> },
              { label: "Net", cell: (p) => ugx(p.net) },
              { label: "Adjustments", cell: (p) => (p.adjustments.length ? p.adjustments.map((a) => `${a.name} ${ugx(a.amount)}`).join(", ") : "—") },
              { label: "", cell: (p) => (d.run.status === "draft" ? <Button variant="text" onClick={() => setAdjusting(p)}>Adjust</Button> : null) },
            ]}
          />
        </div>
      )}
    </LiveData>
  );
}

/** Manual lines on one payslip; negative amounts are deductions. */
function AdjustForm({ slip, close }: { slip: Payslip; close: () => void }) {
  const adjust = useAdjust();
  const [text, setText] = useState(linesToText(slip.adjustments));
  return (
    <Card>
      <div className="grid gap-2">
        <p className="text-subtitle font-bold">{`Adjust ${slip.staffName}`}</p>
        <TextArea label="One per line (Name = amount; use a minus for a deduction)" value={text} onChange={setText} rows={3} />
        <div className="flex gap-2">
          <Button disabled={adjust.isPending} onClick={() => adjust.mutate({ payslipId: slip.id, adjustments: textToLines(text) }, { onSuccess: close })}>Save</Button>
          <Button variant="secondary" onClick={close}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
