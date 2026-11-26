"use client";
// S28-02 Pay runs: every month's run, newest first, and a button to start
// a new month (it builds a draft payslip for each person with a profile).

import { useState } from "react";
import { useRuns, useStartRun } from "@/modules/m28-payroll/data/payrollApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { hotelToday, words } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The runs page. */
export function RunsPage({ screen }: { screen: ScreenContext }) {
  const runs = useRuns();
  const start = useStartRun();
  const address = useAddress();
  const [period, setPeriod] = useState(hotelToday().slice(0, 7));
  const detail = catalog.screen("S28-03")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-end gap-2">
          <TextInput label="Month (YYYY-MM)" value={period} onChange={setPeriod} />
          <Button disabled={!/^\d{4}-(0[1-9]|1[0-2])$/.test(period) || start.isPending} onClick={() => start.mutate(period, { onSuccess: (run) => address.push(recordHref(detail, run.id)) })}>Start pay run</Button>
        </div>
        <LiveData query={runs} name="Pay runs" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(r) => r.id}
              columns={[
                { label: "Month", cell: (r) => <a href={recordHref(detail, r.id)} className="text-primary-text">{r.period}</a> },
                { label: "Status", cell: (r) => <StatusChip status={words(r.status)} /> },
                { label: "Staff", cell: (r) => r.staffCount },
                { label: "Gross", cell: (r) => ugx(r.gross) },
                { label: "Net", cell: (r) => ugx(r.net) },
                { label: "Employer cost", cell: (r) => ugx(r.employerCost) },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
