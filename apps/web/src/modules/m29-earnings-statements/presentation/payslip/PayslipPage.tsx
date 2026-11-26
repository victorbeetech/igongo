"use client";
// S29-02 Payslip: one month's pay, line by line, ready to print.

import { useMyPayslip } from "@/modules/m29-earnings-statements/data/earningsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";

/** A line of the payslip. */
function Line({ name, amount, bold }: { name: string; amount: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-2 text-body ${bold ? "font-bold" : ""}`}>
      <span>{name}</span>
      <span className="tabular-nums">{ugx(amount)}</span>
    </div>
  );
}

/** The payslip; its ID comes from `?payslip=`. */
export function PayslipPage({ screen }: { screen: ScreenContext }) {
  const id = useAddress().params.get("payslip") ?? "";
  const slip = useMyPayslip(id);
  if (!id) return <PurposeText text="Open a payslip from My payslips." />;
  return (
    <LiveData query={slip} name={screen.spec.name}>
      {(p) => (
        <div className="grid max-w-xl gap-3 p-4">
          <Card>
            <h2 className="text-title font-bold">{`Payslip ${p.period}`}</h2>
            <p className="text-caption text-muted">{[p.staffName, p.staffNumber, p.department].filter(Boolean).join(" · ")}</p>
            <div className="mt-2 grid gap-1">
              <Line name="Basic pay" amount={p.basic} />
              {p.earnings.map((l, i) => <Line key={`e${i}`} name={l.name} amount={l.amount} />)}
              <Line name="Gross pay" amount={p.gross} bold />
              {p.deductions.map((l, i) => <Line key={`d${i}`} name={l.name} amount={-l.amount} />)}
              <Line name="Total deductions" amount={-p.totalDeductions} bold />
              <Line name="Net pay" amount={p.net} bold />
            </div>
          </Card>
          <div><Button variant="secondary" onClick={() => window.print()}>Print</Button></div>
        </div>
      )}
    </LiveData>
  );
}
