"use client";
// S66-01 Dispatch board and S66-11 Riders: orders ready for a rider, each
// with a rider to assign from those online; deliveries on the way; riders
// online, and the cash each holds to hand in (S66-08).

import { useState } from "react";
import { useAssign, useDispatchBoard, useReceiveCash } from "@/modules/m66-delivery-riders/data/deliveryApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { timeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

export function DispatchPage({ screen }: { screen: ScreenContext }) {
  const board = useDispatchBoard();
  const assign = useAssign();
  const cash = useReceiveCash();
  const [pick, setPick] = useState<Record<string, string>>({});
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={board} name="Deliveries">
          {(d) => (
            <>
              <SectionHeader title={`Waiting for a rider (${d.waiting.length})`} />
              <DataTable
                rows={d.waiting}
                rowKey={(j) => j.id}
                empty="Nothing waiting."
                columns={[
                  { label: "Order", cell: (j) => j.orderNumber },
                  { label: "To", cell: (j) => j.place.label },
                  { label: "Ready since", cell: (j) => timeOf(j.openedAt) },
                  { label: "Collect", cell: (j) => ugx(j.cashToCollect) },
                  {
                    label: "Rider",
                    cell: (j) => (
                      <span className="flex items-end gap-2">
                        <SelectInput label="Rider" value={pick[j.id] ?? ""} onChange={(r) => setPick({ ...pick, [j.id]: r })} options={[["", "Choose"], ...d.riders.map((r): [string, string] => [r.userId, r.name])]} />
                        <Button disabled={!pick[j.id] || assign.isPending} onClick={() => assign.mutate({ jobId: j.id, riderUserId: pick[j.id] ?? "" })}>Assign</Button>
                      </span>
                    ),
                  },
                ]}
              />
              <SectionHeader title={`On the way (${d.active.length})`} />
              <DataTable rows={d.active} rowKey={(j) => j.id} empty="No deliveries out." columns={[{ label: "Order", cell: (j) => j.orderNumber }, { label: "Rider", cell: (j) => j.riderName ?? "-" }, { label: "To", cell: (j) => j.place.label }, { label: "Status", cell: (j) => <StatusChip status={words(j.status)} /> }]} />
              <SectionHeader title={`Riders online (${d.riders.length})`} />
              <DataTable
                rows={d.riders}
                rowKey={(r) => r.userId}
                empty="No riders online."
                columns={[
                  { label: "Rider", cell: (r) => r.name },
                  { label: "Last seen", cell: (r) => (r.locationAt ? timeOf(r.locationAt) : "-") },
                  { label: "Cash in hand", cell: (r) => ugx(d.done.filter((j) => j.riderUserId === r.userId && !j.cashHandedIn).reduce((s, j) => s + j.cashCollected, 0)) },
                  { label: "", cell: (r) => <Button variant="secondary" onClick={() => cash.mutate(r.userId)}>Receive cash</Button> },
                ]}
              />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
