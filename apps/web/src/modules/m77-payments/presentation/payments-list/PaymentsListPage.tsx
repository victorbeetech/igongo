"use client";
// S77-04 Payments list: every payment with method, status and amount (my
// own for guests; everyone's for finance and till staff).

import { usePayments } from "@/modules/m77-payments/data/paymentsApi";
import { METHOD_NAMES } from "@/modules/m77-payments/domain/methodInfo";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { DataTable } from "@/shared/ui/table/DataTable";

export function PaymentsListPage({ screen }: { screen: ScreenContext }) {
  const list = usePayments(false);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={list} name="Payments">
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(p) => p.id}
              empty="No payments yet."
              columns={[
                { label: "When", cell: (p) => dayTimeOf(p.createdAt) },
                { label: "For", cell: (p) => p.label },
                { label: "Method", cell: (p) => METHOD_NAMES[p.method]?.name ?? p.method },
                { label: "Amount", cell: (p) => ugx(p.amount) },
                { label: "Status", cell: (p) => <StatusChip status={words(p.status)} /> },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
