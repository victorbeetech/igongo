"use client";
// S77-01 Pay and S77-02 Mobile money prompt: pay a bill (an order or a
// booking, from `?module=&record=`) with a method switched on here. Mobile
// money asks for the number and then waits for the PIN on the phone; card
// opens Flutterwave's secure page.

import { useEffect, useState } from "react";
import { usePay, usePayment, useMethods } from "@/modules/m77-payments/data/paymentsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";

export function PayPage({ screen }: { screen: ScreenContext }) {
  const params = useAddress().params;
  const moduleKey = params.get("module") ?? "";
  const recordId = params.get("record") ?? "";
  const methods = useMethods(moduleKey);
  const pay = usePay();
  const [phone, setPhone] = useState("");
  const started = usePayment(pay.data?.id ?? "");
  const payment = started.data ?? pay.data;
  // Card payers go straight to the provider's page.
  const redirect = payment?.status === "pending" ? payment.redirectUrl : null;
  useEffect(() => {
    if (redirect) window.location.assign(redirect);
  }, [redirect]);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {!recordId && <p className="text-body">Open Pay from an order or a booking.</p>}
        {recordId && !payment && (
          <LiveData query={methods} name="Payment methods" isEmpty={(d) => d.items.length === 0}>
            {(d) => (
              <>
                <TextInput label="Mobile money number (for MoMo or Airtel)" type="tel" value={phone} onChange={setPhone} hint="0772 123456" />
                {d.items.map((m) => (
                  <Button key={m.method} block disabled={pay.isPending} onClick={() => pay.mutate({ module: moduleKey, recordId, method: m.method, ...(phone ? { phone } : {}) })}>
                    Pay with {m.name}
                  </Button>
                ))}
              </>
            )}
          </LiveData>
        )}
        {payment && (
          <Card className="grid gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-subtitle font-bold">{payment.label}</h2>
              <StatusChip status={words(payment.status)} />
            </div>
            <p className="text-title font-bold">{ugx(payment.amount)}</p>
            <p className="text-body" role="status">{payment.message ?? "Waiting for the provider."}</p>
          </Card>
        )}
      </div>
    </>
  );
}
