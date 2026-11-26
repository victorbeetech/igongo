"use client";
// S31-02 Give reward: a cash bonus (paid with the next payroll) or buffet
// passes, to one staff member, with a reason from the super admin's list.

import { useState, type FormEvent } from "react";
import { useAwardBonus, useBonusRules, type Bonus } from "@/modules/m31-bonuses-rewards/data/bonusesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The form. */
export function GiveRewardPage({ screen }: { screen: ScreenContext }) {
  const rules = useBonusRules();
  const award = useAwardBonus();
  const [f, setF] = useState({ staffId: "", kind: "" as Bonus["kind"] | "", amount: "", passes: "1", reason: "" });
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name="Reward rules">
        {(r) => {
          const kinds = (["cash", "buffet"] as const).filter((k) => (k === "cash" ? r.cashEnabled : r.buffetEnabled));
          if (kinds.length === 0) return <p className="p-4 text-body">Rewards are switched off.</p>;
          const kind = f.kind || kinds[0]!;
          function submit(event: FormEvent) {
            event.preventDefault();
            award.mutate(
              { staffId: f.staffId, kind, amount: kind === "cash" ? Math.round(Number(f.amount)) : 0, passes: kind === "buffet" ? Math.round(Number(f.passes)) : 0, reason: f.reason },
              { onSuccess: () => setF({ ...f, staffId: "", amount: "", reason: "" }) },
            );
          }
          return (
            <form onSubmit={submit} className="grid max-w-lg gap-3 p-4">
              <StaffSelect value={f.staffId} onChange={(staffId) => setF({ ...f, staffId })} />
              <SelectInput label="Reward" value={kind} onChange={(k) => setF({ ...f, kind: k as Bonus["kind"] })} options={kinds.map((k): [string, string] => [k, k === "cash" ? "Cash bonus" : "Buffet passes"])} />
              {kind === "cash" ? (
                <TextInput label="Amount (UGX)" type="number" value={f.amount} onChange={(amount) => setF({ ...f, amount })} required />
              ) : (
                <TextInput label={`Passes (valid ${r.buffetValidDays} days)`} type="number" value={f.passes} onChange={(passes) => setF({ ...f, passes })} required />
              )}
              {r.reasons.length > 0 ? (
                <SelectInput label="Why" value={f.reason} onChange={(reason) => setF({ ...f, reason })} options={[["", "Choose…"], ...r.reasons.map((x): [string, string] => [x, x])]} />
              ) : (
                <TextInput label="Why" value={f.reason} onChange={(reason) => setF({ ...f, reason })} required />
              )}
              {r.requireApproval && <p className="text-caption text-muted">A manager approves it before it counts.</p>}
              <Button type="submit" disabled={award.isPending || !f.staffId || f.reason.trim().length < 2}>Give reward</Button>
            </form>
          );
        }}
      </LiveData>
    </>
  );
}
