/** Use case: the lifetime statement of one staff member (S29-02). */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { buildStatement } from "../../domain/build-statement";
import type { EarningsStatement } from "../../domain/earnings-statement";
import type { EarningsDeps } from "../earnings-deps";

export async function statementFor(deps: EarningsDeps, staff: StaffRef): Promise<EarningsStatement> {
  // The three histories at once; a switched-off module gives nothing.
  const [payslips, bonuses, advances] = await Promise.all([deps.pay?.forStaff(staff.staffId) ?? [], deps.bonuses?.forStaff(staff.staffId) ?? [], deps.advances?.forStaff(staff.staffId) ?? []]);
  return buildStatement(staff, payslips, bonuses, advances);
}
