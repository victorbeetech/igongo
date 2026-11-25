/**
 * Use case: the attendance board for one day (S25-04, S25-05, S25-06):
 * everyone in scope with their day, plus active staff who have not clocked
 * in at all (absent so far).
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import type { StaffScope } from "@igongo/core";
import { summarizeAll, type DaySummary } from "../../domain/day-summary";
import type { AttendanceDeps } from "../attendance-deps";

export interface BoardRow extends Partial<DaySummary> {
  staff: StaffRef;
  /** present: clocked in at least once; absent: no clock-in yet. */
  state: "present" | "absent";
}

export async function dayBoard(deps: AttendanceDeps, scope: StaffScope, workDate: string): Promise<BoardRow[]> {
  // 1. The people in scope, and their events that day.
  const department = scope.kind === "department" ? scope.department : undefined;
  const staffId = scope.kind === "own" ? scope.staffId : undefined;
  const people = staffId ? [await deps.staff.byId(staffId)].flatMap((s) => (s ? [s] : [])) : await deps.staff.active(department);
  const events = await deps.events.list({ from: workDate, to: workDate, ...(department ? { department } : {}), ...(staffId ? { staffId } : {}) });
  const days = new Map(summarizeAll(events, deps.change.now).map((d) => [d.staffId, d]));
  // 2. One row per person: present with their day, or absent.
  return people.map((staff) => {
    const day = days.get(staff.staffId);
    return day ? { ...day, staff, state: "present" } : { staff, state: "absent" };
  });
}
