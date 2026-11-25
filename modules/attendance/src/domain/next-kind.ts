/** A tap toggles: in if the person is out, out if they are in. */

import type { ClockEvent, ClockKind } from "./clock-event";

/** The kind of the next event after [last] (the person's latest event, if any). */
export function nextKind(last: ClockEvent | null): ClockKind {
  return last?.kind === "in" ? "out" : "in";
}
