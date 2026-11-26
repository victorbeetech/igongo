"use client";
// S77-03 Payment result: where card payers come back to, and the link in
// every receipt. Shows paid, failed or still pending (asks again every few
// seconds while pending).

import { usePayment } from "@/modules/m77-payments/data/paymentsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";

export function PaymentResultPage({ screen }: { screen: ScreenContext }) {
  const payment = usePayment(recordIdOf(useAddress().path));
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={payment} name="Your payment">
          {(p) => (
            <Card className="grid gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-subtitle font-bold">{p.label}</h2>
                <StatusChip status={words(p.status)} />
              </div>
              <p className="text-title font-bold">{ugx(p.amount)}</p>
              <p className="text-body">{p.message ?? (p.status === "pending" ? "Waiting for the provider to confirm." : "")}</p>
            </Card>
          )}
        </LiveData>
      </div>
    </>
  );
}
