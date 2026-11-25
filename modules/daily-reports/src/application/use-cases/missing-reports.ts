/** Use case: active staff in scope who have not sent a report for a day (S38-08). */

import type { StaffRef } from "@igongo/contracts/hr-records";
import type { StaffScope } from "@igongo/core";
import type { ReportsDeps } from "../reports-deps";

export async function missingReports(deps: ReportsDeps, scope: StaffScope, workDate: string): Promise<StaffRef[]> {
  const department = scope.kind === "department" ? scope.department : undefined;
  const people = (await deps.staff.active(department)).filter((s) => scope.kind !== "own" || s.staffId === scope.staffId);
  const sent = await deps.reports.list({ from: workDate, to: workDate, ...(department ? { department } : {}), limit: 5000 });
  // Drafts do not count as sent.
  const done = new Set(sent.filter((r) => r.status !== "draft").map((r) => r.staffId));
  return people.filter((p) => !done.has(p.staffId));
}
