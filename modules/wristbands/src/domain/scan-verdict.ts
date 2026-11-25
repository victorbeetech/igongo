/** The door's answer for a band, as a pure rule. */

import type { ScanResult } from "./band-scan";
import type { Wristband } from "./wristband";

/** What to tell the door about [band] when checking for [eventKey] (or any event). */
export function scanVerdict(band: Wristband | null, eventKey: string | null): ScanResult {
  if (!band) return "unknown";
  if (band.status === "missing" || band.status === "retired") return "blocked";
  if (band.status !== "assigned") return "not_assigned";
  if (eventKey && band.eventKey !== eventKey) return "wrong_event";
  return "ok";
}
