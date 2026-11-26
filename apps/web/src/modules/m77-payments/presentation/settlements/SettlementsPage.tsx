"use client";
// S77-07 Settlements: money in for a range of hotel days, by day, method,
// module and outlet, with refunds taken off, ready to match against the
// bank and mobile money statements.

import { useState } from "react";
import { useSettlement } from "@/modules/m77-payments/data/paymentsApi";
import { downloadFile } from "@/shared/api/downloadFile";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { hotelToday, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The page; it opens on today. */
export function SettlementsPage({ screen }: { screen: ScreenContext }) {
  const [range, setRange] = useState({ from: hotelToday(), to: hotelToday() });
  const settlement = useSettlement(range.from, range.to);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-end gap-2">
          <TextInput label="From" type="date" value={range.from} onChange={(from) => setRange({ ...range, from })} />
          <TextInput label="To" type="date" value={range.to} onChange={(to) => setRange({ ...range, to })} />
          <Button variant="secondary" disabled={range.from > range.to} onClick={() => void downloadFile(`/api/payments/settlement.csv?from=${range.from}&to=${range.to}`, `settlement-${range.from}-${range.to}.csv`)}>Download spreadsheet</Button>
        </div>
        <LiveData query={settlement} name="Settlement" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <>
              <div className="max-w-xs"><KpiCard label="Net money in" value={ugx(d.total)} /></div>
              <DataTable
                rows={d.items}
                rowKey={(r) => `${r.day}-${r.method}-${r.module}-${r.outlet ?? ""}`}
                columns={[
                  { label: "Day", cell: (r) => r.day },
                  { label: "Method", cell: (r) => words(r.method) },
                  { label: "Area", cell: (r) => words(r.module) },
                  { label: "Outlet", cell: (r) => r.outlet ?? "—" },
                  { label: "Payments", cell: (r) => r.count },
                  { label: "Amount", cell: (r) => ugx(r.amount) },
                  { label: "Refunded", cell: (r) => ugx(r.refunded) },
                  { label: "Net", cell: (r) => ugx(r.net) },
                ]}
              />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
