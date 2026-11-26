"use client";
// S31-03 Rewards list: every reward in my scope; pending ones can be
// approved or declined (never by the person who gave them).

import { useState } from "react";
import { useBonuses, useDecideBonus, type Bonus } from "@/modules/m31-bonuses-rewards/data/bonusesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { DataTable } from "@/shared/ui/table/DataTable";

const STATUSES: Bonus["status"][] = ["pending", "approved", "paid", "used", "declined"];

/** The list. */
export function RewardsListPage({ screen }: { screen: ScreenContext }) {
  const [status, setStatus] = useState("");
  const list = useBonuses(status);
  const decide = useDecideBonus();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <SelectInput label="Status" value={status} onChange={setStatus} options={[["", "All"], ...STATUSES.map((s): [string, string] => [s, words(s)])]} />
        <LiveData query={list} name="Rewards" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(b) => b.id}
              columns={[
                { label: "Staff", cell: (b) => b.staffName },
                { label: "Reward", cell: (b) => (b.kind === "cash" ? ugx(b.amount) : `${b.passes} passes (${b.passesUsed} used)`) },
                { label: "Why", cell: (b) => b.reason },
                { label: "Given by", cell: (b) => `${b.awardedByName}, ${dayTimeOf(b.createdAt)}` },
                { label: "Status", cell: (b) => <StatusChip status={words(b.status)} /> },
                {
                  label: "",
                  cell: (b) =>
                    b.status === "pending" ? (
                      <span className="flex gap-1">
                        <Button variant="text" disabled={decide.isPending} onClick={() => decide.mutate({ id: b.id, approve: true })}>Approve</Button>
                        <Button variant="text" disabled={decide.isPending} onClick={() => decide.mutate({ id: b.id, approve: false })}>Decline</Button>
                      </span>
                    ) : null,
                },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
