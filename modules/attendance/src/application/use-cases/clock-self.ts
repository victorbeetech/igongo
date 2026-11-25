/** Use case: a staff member clocks in or out from their own phone (S25-01). */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError } from "@igongo/core";
import type { ClockEvent } from "../../domain/clock-event";
import type { AttendanceDeps } from "../attendance-deps";
import { recordClock } from "./record-clock";

/** The station name for clocks from the app. */
export const APP_STATION = "App";

/** @throws AppError `method_disabled` when the rules allow clocking only at a station */
export async function clockSelf(deps: AttendanceDeps, self: StaffRef): Promise<ClockEvent> {
  if (!(await deps.rules.read()).allowAppClock) throw new AppError("method_disabled", "Clock in at the gate or reception with your card.");
  return recordClock(deps, { staff: self, method: "app", station: APP_STATION });
}
