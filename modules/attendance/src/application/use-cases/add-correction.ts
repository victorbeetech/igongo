/**
 * Use case: HR or a supervisor adds a missed clock-in or clock-out with a
 * reason (S25-08). The original events stay; this is an extra event.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError } from "@igongo/core";
import type { ClockEvent, ClockKind } from "../../domain/clock-event";
import type { AttendanceDeps } from "../attendance-deps";
import { recordClock } from "./record-clock";

/** @throws AppError `bad_request` for a time in the future */
export async function addCorrection(deps: AttendanceDeps, staff: StaffRef, input: { kind: ClockKind; at: Date; reason: string }): Promise<ClockEvent> {
  if (input.at.getTime() > deps.change.now.getTime()) throw new AppError("bad_request", "A correction cannot be in the future.");
  return recordClock(deps, { staff, method: "manual", station: "Correction", kind: input.kind, at: input.at, note: input.reason });
}
