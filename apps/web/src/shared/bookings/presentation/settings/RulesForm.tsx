"use client";
// The booking rules form: deposit, approval, cancel deadline and the most per booking.
// Saves through the API. Shown only to people with the module's settings permission.

import { useState } from "react";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useSaveRules } from "../../data/bookingsApi";
import type { BookingPlace } from "../../types/bookingPlace";
import type { BookingRules } from "../../types/bookingRules";

/** The rules form, starting from the saved rules. */
export function RulesForm({ place, initial }: { place: BookingPlace; initial: BookingRules }) {
  const save = useSaveRules(place);
  const [r, setR] = useState(initial);
  // Turns a typed number into the rule; a blank or bad entry becomes zero.
  const num = (k: keyof BookingRules) => (v: string) => setR({ ...r, [k]: Number(v) || 0 });
  return (
    <Card className="grid gap-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <TextInput label="Deposit (% of total)" type="number" value={String(r.depositPercent)} onChange={num("depositPercent")} />
        <TextInput label="Cancel up to (hours before)" type="number" value={String(r.cancelHoursBefore)} onChange={num("cancelHoursBefore")} />
        <TextInput label="Most per booking" type="number" value={String(r.maxUnits)} onChange={num("maxUnits")} />
      </div>
      <SwitchRow label="Staff approve every booking" on={r.requireApproval} onChange={(requireApproval) => setR({ ...r, requireApproval })} />
      <Button onClick={() => save.mutate(r)} disabled={save.isPending}>
        Save rules
      </Button>
    </Card>
  );
}
