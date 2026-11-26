"use client";
// S28-07 Statutory settings: the deductions (such as PAYE bands and NSSF
// rates) exactly as the hotel's accountant gives them. No rates are built
// in; the super admin enters every one.

import { useState } from "react";
import { usePayrollSettings, useSavePayrollSettings, type DeductionRule, type PayrollSettings } from "@/modules/m28-payroll/data/payrollApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** Bands as text: "upTo:rate" pairs separated by commas; "*" means no top. */
const bandsToText = (bands: DeductionRule["bands"]) => bands.map((b) => `${b.upTo ?? "*"}:${b.rate}`).join(", ");
const textToBands = (text: string): DeductionRule["bands"] =>
  text.split(",").map((p) => p.trim().split(":")).filter((p) => p.length === 2).map(([upTo, rate]) => ({ upTo: upTo!.trim() === "*" ? null : Number(upTo), rate: Number(rate) })).filter((b) => !Number.isNaN(b.rate) && (b.upTo === null || !Number.isNaN(b.upTo)));

/** A fresh rule. */
const blankRule = (n: number): DeductionRule => ({ key: `rule-${n}`, name: "", kind: "percent", rate: 0, amount: 0, bands: [], base: "gross", employerRate: 0 });

/** The settings page. */
export function DeductionsPage({ screen }: { screen: ScreenContext }) {
  const settings = usePayrollSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>{(s) => <SettingsForm key={JSON.stringify(s)} initial={s} />}</LiveData>
    </>
  );
}

/** Every rule, saved together. */
function SettingsForm({ initial }: { initial: PayrollSettings }) {
  const save = useSavePayrollSettings();
  const [s, setS] = useState(initial);
  const [bands, setBands] = useState(initial.deductions.map((d) => bandsToText(d.bands)));
  const set = (i: number, change: Partial<DeductionRule>) => setS({ ...s, deductions: s.deductions.map((d, j) => (j === i ? { ...d, ...change } : d)) });
  const num = (v: string) => Number(v) || 0;
  return (
    <div className="grid max-w-3xl gap-3 p-4">
      <SwitchRow label="The approver must be a different person from the maker" on={s.approverMustDiffer} onChange={(approverMustDiffer) => setS({ ...s, approverMustDiffer })} />
      {s.deductions.length === 0 && <p className="text-caption text-muted">No deductions yet. Add them as the accountant gives them.</p>}
      {s.deductions.map((d, i) => (
        <Card key={i}>
          <div className="grid gap-2 sm:grid-cols-2">
            <TextInput label="Name" value={d.name} onChange={(name) => set(i, { name, key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || d.key })} />
            <SelectInput label="Kind" value={d.kind} onChange={(kind) => set(i, { kind: kind as DeductionRule["kind"] })} options={[["percent", "Percent"], ["fixed", "Fixed amount"], ["bands", "Tax bands"]]} />
            <SelectInput label="Worked out on" value={d.base} onChange={(base) => set(i, { base: base as DeductionRule["base"] })} options={[["gross", "Gross pay"], ["basic", "Basic pay"]]} />
            {d.kind === "percent" && <TextInput label="Staff rate (%)" type="number" value={String(d.rate)} onChange={(v) => set(i, { rate: num(v) })} />}
            {d.kind === "fixed" && <TextInput label="Amount (UGX)" type="number" value={String(d.amount)} onChange={(v) => set(i, { amount: num(v) })} />}
            {d.kind === "bands" && <TextInput label="Bands (up to:rate, …; * for the top)" value={bands[i] ?? ""} onChange={(v) => { setBands(bands.map((b, j) => (j === i ? v : b))); set(i, { bands: textToBands(v) }); }} />}
            <TextInput label="Employer rate (%)" type="number" value={String(d.employerRate)} onChange={(v) => set(i, { employerRate: num(v) })} />
          </div>
          <Button variant="text" onClick={() => { setS({ ...s, deductions: s.deductions.filter((_, j) => j !== i) }); setBands(bands.filter((_, j) => j !== i)); }}>Remove</Button>
        </Card>
      ))}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => { setS({ ...s, deductions: [...s.deductions, blankRule(s.deductions.length + 1)] }); setBands([...bands, ""]); }}>Add deduction</Button>
        <Button onClick={() => save.mutate({ ...s, deductions: s.deductions.filter((d) => d.name.trim()) })} disabled={save.isPending}>Save deductions</Button>
      </div>
    </div>
  );
}
