/**
 * Use case: record a clock-in or clock-out for a staff member. Shared by the
 * app, the gate and reception. Steps:
 *   1. ignore double taps (closer than the rules allow),
 *   2. toggle in/out from the person's last event,
 *   3. mark a first clock-in of the day late if it is after start + grace,
 *   4. save the event and record it in the Audit Trail.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import { isLate } from "../../domain/attendance-rules";
import type { ClockEvent, ClockKind, ClockMethod } from "../../domain/clock-event";
import { nextKind } from "../../domain/next-kind";
import type { AttendanceDeps } from "../attendance-deps";

export interface RecordClockInput {
  staff: StaffRef;
  method: ClockMethod;
  station: string;
  /** Force in or out (corrections); otherwise the tap toggles. */
  kind?: ClockKind;
  /** When it happened (corrections); otherwise now. */
  at?: Date;
  note?: string;
}

/** @throws AppError `conflict` for a double tap, `permission_denied` for staff who are not active */
export async function recordClock(deps: AttendanceDeps, input: RecordClockInput): Promise<ClockEvent> {
  const { staff } = input;
  if (staff.status !== "active") throw new AppError("permission_denied", `${staff.name} is not an active staff member.`);
  const rules = await deps.rules.read();
  const at = input.at ?? deps.change.now;
  const last = await deps.events.latestFor(staff.staffId);
  // 1. A second tap within seconds is the same tap.
  if (!input.at && last && at.getTime() - last.at.getTime() < rules.doubleTapSeconds * 1000) {
    throw new AppError("conflict", `${staff.name} was just clocked ${last.kind}. Wait a minute before tapping again.`);
  }
  // 2 and 3. In or out, and late or not.
  const kind = input.kind ?? nextKind(last);
  const workDate = hotelDate(at);
  const late = kind === "in" && !(await deps.events.hasInOn(staff.staffId, workDate)) && isLate(rules, at);
  const event: ClockEvent = {
    id: newId("clk"),
    staffId: staff.staffId,
    department: staff.department,
    kind,
    method: input.method,
    at,
    workDate,
    station: input.station,
    late,
    recordedBy: deps.change.actorId,
    note: input.note ?? null,
  };
  // 4. Save and record.
  await deps.events.add(event);
  await recordChange(deps.change, {
    module: "attendance",
    action: input.method === "manual" ? "attendance.corrected" : `attendance.clock_${kind}`,
    recordType: "staff",
    recordId: staff.staffId,
    summary: `${staff.name} clocked ${kind} at ${input.station}${late ? " (late)" : ""}${input.note ? `: ${input.note}` : ""}`,
  });
  return event;
}
