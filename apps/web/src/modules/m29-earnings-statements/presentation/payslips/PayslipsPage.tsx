"use client";
// S29-01 My payslips: every payslip I have had, newest first.

import { useMyStatement } from "@/modules/m29-earnings-statements/data/earningsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { ListRow } from "@/shared/ui/list-row/ListRow";

/** The payslip list. */
export function PayslipsPage({ screen }: { screen: ScreenContext }) {
  const statement = useMyStatement();
  const slip = catalog.hrefOf(catalog.screen("S29-02")!);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={statement} name="Payslips" isEmpty={(s) => s.payslips.length === 0}>
        {(s) => (
          <div className="grid gap-1 p-4">
            {[...s.payslips].sort((a, b) => b.period.localeCompare(a.period)).map((p) => (
              <ListRow key={p.payslipId} title={p.period} subtitle={`Net ${ugx(p.net)} · gross ${ugx(p.gross)}`} status={words(p.status)} href={`${slip}?payslip=${p.payslipId}`} />
            ))}
          </div>
        )}
      </LiveData>
    </>
  );
}
