"use client";
// S31-04 Buffet passes: the buffet attendant's station. A card reader types
// the card number into the box (or the attendant picks the person); the
// answer says whether to serve them and how many passes are left.

import { useState, type FormEvent } from "react";
import { useRedeem, type RedeemResult } from "@/modules/m31-bonuses-rewards/data/bonusesApi";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The station. */
export function BuffetStationPage({ screen }: { screen: ScreenContext }) {
  const redeem = useRedeem();
  const [code, setCode] = useState("");
  const [staffId, setStaffId] = useState("");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const show = (r: RedeemResult) => setResult(r);
  function tap(event: FormEvent) {
    event.preventDefault();
    // A QR text starts with IGG-CARD: (it has a colon); a card number does not.
    const body = code.includes(":") ? { qr: code.trim() } : { uid: code.trim() };
    redeem.mutate(body, { onSuccess: (r) => { show(r); setCode(""); } });
  }
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-lg gap-3 p-4">
        {result && (
          <Card>
            <div role="status" className="flex flex-wrap items-center gap-2">
              <StatusChip status={result.ok ? "Approved" : "Refused"} />
              <span className="text-subtitle font-bold">{result.ok ? `${result.staffName}: ${result.passesLeft} pass${result.passesLeft === 1 ? "" : "es"} left` : result.message}</span>
            </div>
          </Card>
        )}
        <form onSubmit={tap} className="grid gap-2">
          <TextInput label="Tap or scan the staff card" value={code} onChange={setCode} autoComplete="off" />
          <Button type="submit" disabled={code.trim().length < 4 || redeem.isPending}>Check card</Button>
        </form>
        <StaffSelect label="Or choose the person" value={staffId} onChange={setStaffId} />
        <Button variant="secondary" disabled={!staffId || redeem.isPending} onClick={() => redeem.mutate({ staffId }, { onSuccess: show })}>Use a pass</Button>
      </div>
    </>
  );
}
