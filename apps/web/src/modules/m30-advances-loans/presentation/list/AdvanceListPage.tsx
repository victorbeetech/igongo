"use client";
// S30-03 Advance requests and S30-04 Loans: everyone's advances in my
// scope, by status. Loans are the same list showing loans only.

import { useState } from "react";
import { useAdvances, type Advance } from "@/modules/m30-advances-loans/data/advancesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { DataTable } from "@/shared/ui/table/DataTable";

const STATUSES: Advance["status"][] = ["requested", "approved", "disbursed", "repaid", "declined", "cancelled"];

/** The list, for one kind or both. */
export function AdvanceListPage({ screen, kind }: { screen: ScreenContext; kind?: Advance["kind"] }) {
  const [status, setStatus] = useState(kind ? "" : "requested");
  const list = useAdvances(status);
  const detail = catalog.screen("S30-05")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <SelectInput label="Status" value={status} onChange={setStatus} options={[["", "All"], ...STATUSES.map((s): [string, string] => [s, words(s)])]} />
        <LiveData query={list} name="Requests" isEmpty={(d) => d.items.filter((a) => !kind || a.kind === kind).length === 0}>
          {(d) => (
            <DataTable
              rows={d.items.filter((a) => !kind || a.kind === kind)}
              rowKey={(a) => a.id}
              columns={[
                { label: "Number", cell: (a) => <a href={recordHref(detail, a.id)} className="text-primary-text">{a.number}</a> },
                { label: "Staff", cell: (a) => `${a.staffName}${a.department ? ` · ${a.department}` : ""}` },
                { label: "Kind", cell: (a) => words(a.kind) },
                { label: "Amount", cell: (a) => ugx(a.amount) },
                { label: "Left", cell: (a) => ugx(Math.max(0, a.amount - a.repaid)) },
                { label: "Asked", cell: (a) => dayTimeOf(a.requestedAt) },
                { label: "Status", cell: (a) => <StatusChip status={words(a.status)} /> },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
