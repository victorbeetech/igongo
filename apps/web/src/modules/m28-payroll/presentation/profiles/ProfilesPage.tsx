"use client";
// S28-01 Payroll home: every active staff member with their pay profile
// (basic pay, allowances, how they are paid). People without one are shown
// first so nobody is left out of a pay run.

import { useState } from "react";
import { PAY_METHODS, useProfiles, useSaveProfile, type PayProfile } from "@/modules/m28-payroll/data/payrollApi";
import { linesToText, textToLines } from "@/modules/m28-payroll/domain/payLines";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine, type StaffRef } from "@/shared/api/types/staffRef";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The profiles page. */
export function ProfilesPage({ screen }: { screen: ScreenContext }) {
  const profiles = useProfiles();
  const [editing, setEditing] = useState<{ staff: StaffRef; profile: PayProfile | null } | null>(null);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Button href={catalog.hrefOf(catalog.screen("S28-02")!)}>Pay runs</Button>
          <Button variant="secondary" href={catalog.hrefOf(catalog.screen("S28-07")!)}>Deductions</Button>
        </div>
        {editing && <ProfileForm key={editing.staff.staffId} staff={editing.staff} initial={editing.profile} close={() => setEditing(null)} />}
        <LiveData query={profiles} name="Pay profiles" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <DataTable
              rows={[...d.items].sort((a, b) => Number(!!a.profile) - Number(!!b.profile))}
              rowKey={(r) => r.staff.staffId}
              columns={[
                { label: "Staff", cell: (r) => staffLine(r.staff) },
                { label: "Basic", cell: (r) => (r.profile ? ugx(r.profile.basic) : "Not set") },
                { label: "Allowances", cell: (r) => (r.profile ? ugx(r.profile.allowances.reduce((n, a) => n + a.amount, 0)) : "—") },
                { label: "Paid by", cell: (r) => (r.profile ? words(r.profile.payMethod) : "—") },
                { label: "", cell: (r) => <Button variant="text" onClick={() => setEditing(r)}>{r.profile ? "Edit" : "Set pay"}</Button> },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}

/** One person's pay profile form. */
function ProfileForm({ staff, initial, close }: { staff: StaffRef; initial: PayProfile | null; close: () => void }) {
  const save = useSaveProfile();
  const [p, setP] = useState({ basic: String(initial?.basic ?? ""), allowances: linesToText(initial?.allowances ?? []), payMethod: initial?.payMethod ?? "bank", account: initial?.account ?? "", active: initial?.active ?? true });
  function send() {
    const profile: PayProfile = { basic: Math.round(Number(p.basic) || 0), allowances: textToLines(p.allowances).filter((a) => a.amount >= 0), payMethod: p.payMethod as PayProfile["payMethod"], account: p.account || null, active: p.active };
    save.mutate({ staffId: staff.staffId, profile }, { onSuccess: close });
  }
  return (
    <Card>
      <div className="grid gap-2">
        <p className="text-subtitle font-bold">{staffLine(staff)}</p>
        <TextInput label="Basic pay a month (UGX)" type="number" value={p.basic} onChange={(basic) => setP({ ...p, basic })} />
        <TextArea label="Allowances, one per line (Name = amount)" value={p.allowances} onChange={(allowances) => setP({ ...p, allowances })} rows={3} />
        <SelectInput label="Paid by" value={p.payMethod} onChange={(payMethod) => setP({ ...p, payMethod: payMethod as PayProfile["payMethod"] })} options={PAY_METHODS.map((m): [string, string] => [m, words(m)])} />
        <TextInput label="Account or phone number" value={p.account} onChange={(account) => setP({ ...p, account })} />
        <SwitchRow label="Include in pay runs" on={p.active} onChange={(active) => setP({ ...p, active })} />
        <div className="flex gap-2">
          <Button onClick={send} disabled={save.isPending}>Save</Button>
          <Button variant="secondary" onClick={close}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
