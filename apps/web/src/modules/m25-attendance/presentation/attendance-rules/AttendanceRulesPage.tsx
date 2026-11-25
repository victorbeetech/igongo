"use client";
// S25-11 Attendance rules: when the day starts, the grace before "late",
// whether staff may clock in from their phones, and the double-tap guard.

import { useState } from "react";
import { useRules, useSaveRules, type AttendanceRules } from "@/modules/m25-attendance/data/attendanceApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The rules page. */
export function AttendanceRulesPage({ screen }: { screen: ScreenContext }) {
  const rules = useRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name={screen.spec.name}>{(r) => <RulesForm key={JSON.stringify(r)} initial={r} />}</LiveData>
    </>
  );
}

/** The form, filled with the saved rules. */
function RulesForm({ initial }: { initial: AttendanceRules }) {
  const save = useSaveRules();
  const [r, setR] = useState(initial);
  return (
    <form className="grid max-w-lg gap-3 p-4" onSubmit={(e) => { e.preventDefault(); save.mutate(r); }}>
      <TextInput label="Working day starts at" type="time" value={r.dayStartsAt} onChange={(dayStartsAt) => setR({ ...r, dayStartsAt })} required />
      <TextInput label="Minutes of grace before late" type="number" value={String(r.graceMinutes)} onChange={(v) => setR({ ...r, graceMinutes: Number(v) })} />
      <TextInput label="Ignore repeat taps within (seconds)" type="number" value={String(r.doubleTapSeconds)} onChange={(v) => setR({ ...r, doubleTapSeconds: Number(v) })} />
      <SwitchRow label="Staff may clock in from their own phone" hint="Off means the gate or reception only" on={r.allowAppClock} onChange={(allowAppClock) => setR({ ...r, allowAppClock })} />
      <Button type="submit" disabled={save.isPending}>Save rules</Button>
    </form>
  );
}
