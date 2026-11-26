"use client";
// S30-05 Loan detail: one advance or loan with its repayments and the steps
// a manager may take: approve or decline, pay out, take a cash repayment.
// Payroll takes the monthly instalments by itself.

import { useState } from "react";
import { useAdvance, useDecideAdvance, useDisburseAdvance, useRepayAdvance } from "@/modules/m30-advances-loans/data/advancesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The detail page; the ID is the last part of the address. */
export function AdvanceDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const advance = useAdvance(id);
  const decide = useDecideAdvance(id);
  const disburse = useDisburseAdvance(id);
  const repay = useRepayAdvance(id);
  const [note, setNote] = useState("");
  const [cash, setCash] = useState("");
  return (
    <LiveData query={advance} name={screen.spec.name}>
      {({ advance: a, repayments }) => (
        <div className="grid max-w-3xl gap-3 p-4">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title font-bold">{`${a.number} · ${a.staffName}`}</h2>
              <StatusChip status={words(a.status)} />
            </div>
            <p className="text-body">{`${words(a.kind)} of ${ugx(a.amount)}, ${a.instalments} × ${ugx(a.instalmentAmount)} from ${a.startPeriod}`}</p>
            <p className="text-body">{a.reason}</p>
            <p className="text-caption text-muted">{`Asked ${dayTimeOf(a.requestedAt)} · repaid ${ugx(a.repaid)} · left ${ugx(Math.max(0, a.amount - a.repaid))}`}</p>
            {a.decidedByName && <p className="text-caption">{`Decided by ${a.decidedByName}${a.decisionNote ? `: ${a.decisionNote}` : ""}`}</p>}
            {a.disbursedByName && <p className="text-caption">{`Paid out by ${a.disbursedByName}`}</p>}
          </Card>
          {a.status === "requested" && (
            <>
              <TextInput label="Note to the staff member" value={note} onChange={setNote} />
              <div className="flex gap-2">
                <Button disabled={decide.isPending} onClick={() => decide.mutate({ approve: true, note: note || null })}>Approve</Button>
                <Button variant="danger" disabled={decide.isPending} onClick={() => decide.mutate({ approve: false, note: note || null })}>Decline</Button>
              </div>
            </>
          )}
          {a.status === "approved" && <div><Button disabled={disburse.isPending} onClick={() => disburse.mutate(undefined)}>Mark as paid out</Button></div>}
          {a.status === "disbursed" && (
            <div className="flex flex-wrap items-end gap-2">
              <TextInput label="Cash repayment (UGX)" type="number" value={cash} onChange={setCash} />
              <Button variant="secondary" disabled={repay.isPending || !(Number(cash) > 0)} onClick={() => repay.mutate(Math.round(Number(cash)), { onSuccess: () => setCash("") })}>Record repayment</Button>
            </div>
          )}
          <SectionHeader title="Repayments" />
          <DataTable
            rows={repayments}
            rowKey={(r) => r.id}
            empty="No repayments yet."
            columns={[
              { label: "Month", cell: (r) => r.period },
              { label: "Amount", cell: (r) => ugx(r.amount) },
              { label: "How", cell: (r) => (r.payRunId ? "Payroll" : `Cash, taken by ${r.byName}`) },
              { label: "When", cell: (r) => dayTimeOf(r.at) },
            ]}
          />
        </div>
      )}
    </LiveData>
  );
}
