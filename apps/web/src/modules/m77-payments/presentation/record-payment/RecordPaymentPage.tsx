"use client";
// S77-08 Record cash payment and S77-10 Till: till staff record money taken
// by hand (cash, bank transfer, charge to room, corporate account) against
// an order or booking number from its page.

import { useState } from "react";
import { useMethods, useRecordPayment } from "@/modules/m77-payments/data/paymentsApi";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";

/** Selling modules a till can take payment for. */
const MODULES: [string, string][] = [["food-ordering", "Food order"], ["room-bookings", "Room booking"], ["museum", "Museum"], ["events-conferences", "Event"], ["pool", "Pool"], ["crafts-bookshop", "Shop"]];

export function RecordPaymentPage({ screen }: { screen: ScreenContext }) {
  const params = useAddress().params;
  const [v, setV] = useState({ module: params.get("module") ?? "food-ordering", recordId: params.get("record") ?? "", method: "cash", amount: "", reference: "" });
  const methods = useMethods(v.module);
  const record = useRecordPayment();
  const staffMethods = (methods.data?.items ?? []).filter((m) => m.kind === "staff");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <Card className="m-4 grid gap-2">
        <SelectInput label="For" value={v.module} onChange={(module) => setV({ ...v, module })} options={MODULES} />
        <TextInput label="Order or booking ID" value={v.recordId} onChange={(recordId) => setV({ ...v, recordId })} />
        <SelectInput label="Method" value={v.method} onChange={(method) => setV({ ...v, method })} options={staffMethods.map((m) => [m.method, m.name])} />
        <TextInput label="Amount (empty: everything owed)" type="number" value={v.amount} onChange={(amount) => setV({ ...v, amount })} />
        <TextInput label="Receipt, slip or room number" value={v.reference} onChange={(reference) => setV({ ...v, reference })} />
        <Button disabled={record.isPending || !v.recordId} onClick={() => record.mutate({ module: v.module, recordId: v.recordId, method: v.method, ...(v.amount ? { amount: Number(v.amount) } : {}), ...(v.reference ? { reference: v.reference } : {}) })}>
          Record payment
        </Button>
        {record.data && <p role="status" className="text-body">Recorded {ugx(record.data.amount)} for {record.data.label}.</p>}
      </Card>
    </>
  );
}
