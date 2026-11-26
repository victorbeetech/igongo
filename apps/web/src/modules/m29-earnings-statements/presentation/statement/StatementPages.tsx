"use client";
// S29-03 Lifetime earnings (mine) and S29-04 Earnings statement (anyone in
// my scope, chosen from the staff list).

import { useState } from "react";
import { useMyStatement, useStaffStatement } from "@/modules/m29-earnings-statements/data/earningsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StaffSelect } from "@/shared/staff/StaffSelect";
import { StatementView } from "./StatementView";

/** S29-03: my own statement. */
export function MyStatementPage({ screen }: { screen: ScreenContext }) {
  const statement = useMyStatement();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={statement} name={screen.spec.name}>{(s) => <StatementView statement={s} csvPath="/api/earnings/mine/export.csv" />}</LiveData>
      </div>
    </>
  );
}

/** S29-04: someone's statement (HR and payroll). */
export function StaffStatementPage({ screen }: { screen: ScreenContext }) {
  const [staffId, setStaffId] = useState("");
  const statement = useStaffStatement(staffId);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <StaffSelect value={staffId} onChange={setStaffId} />
        {staffId && <LiveData query={statement} name={screen.spec.name}>{(s) => <StatementView statement={s} csvPath={`/api/earnings/staff/${staffId}/export.csv`} />}</LiveData>}
      </div>
    </>
  );
}
