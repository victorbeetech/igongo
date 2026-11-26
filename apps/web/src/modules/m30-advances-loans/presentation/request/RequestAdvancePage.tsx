"use client";
// S30-02 Request advance: how much, an advance or a loan, how many months
// to repay, and why. The super admin's limits (S30-06) are shown up front.

import { useState, type FormEvent } from "react";
import { useMyAdvances, useRequestAdvance, type Advance } from "@/modules/m30-advances-loans/data/advancesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The request form. */
export function RequestAdvancePage({ screen }: { screen: ScreenContext }) {
  const mine = useMyAdvances();
  const request = useRequestAdvance();
  const address = useAddress();
  const [f, setF] = useState({ kind: "advance" as Advance["kind"], amount: "", instalments: "1", reason: "" });
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={mine} name="Advance rules">
        {({ rules }) => {
          const kinds = (["advance", "loan"] as const).filter((k) => rules[k].enabled);
          if (kinds.length === 0) return <p className="p-4 text-body">Advances and loans are switched off.</p>;
          const rule = rules[f.kind];
          function submit(event: FormEvent) {
            event.preventDefault();
            request.mutate({ kind: f.kind, amount: Math.round(Number(f.amount)), instalments: Math.round(Number(f.instalments)) || 1, reason: f.reason }, { onSuccess: () => address.push(catalog.hrefOf(catalog.screen("S30-01")!)) });
          }
          return (
            <form onSubmit={submit} className="grid max-w-lg gap-3 p-4">
              <SelectInput label="What" value={f.kind} onChange={(kind) => setF({ ...f, kind: kind as Advance["kind"] })} options={kinds.map((k): [string, string] => [k, k === "advance" ? "Salary advance" : "Staff loan"])} />
              <p className="text-caption text-muted">{`${rule.maxAmount > 0 ? `Up to ${ugx(rule.maxAmount)}` : "No set limit"}, repaid in at most ${rule.maxInstalments} month${rule.maxInstalments === 1 ? "" : "s"}.${rules.oneOpenAtATime ? " One open at a time." : ""}`}</p>
              <TextInput label="Amount (UGX)" type="number" value={f.amount} onChange={(amount) => setF({ ...f, amount })} required />
              <TextInput label="Months to repay" type="number" value={f.instalments} onChange={(instalments) => setF({ ...f, instalments })} />
              <TextArea label="Why" value={f.reason} onChange={(reason) => setF({ ...f, reason })} rows={3} required />
              <Button type="submit" disabled={request.isPending || !(Number(f.amount) > 0) || f.reason.trim().length < 3}>Send request</Button>
            </form>
          );
        }}
      </LiveData>
    </>
  );
}
