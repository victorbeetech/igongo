/**
 * A fault's life (S40-03): reported `open`, `assigned` to a technician,
 * `in_progress`, maybe `on_hold` (waiting for a part), `fixed` by the
 * technician, then `closed` by the reporter's HOD or maintenance. A fixed
 * fault can be reopened. `cancelled` is for duplicates and mistakes.
 */

export const FAULT_STATUSES = ["open", "assigned", "in_progress", "on_hold", "fixed", "closed", "cancelled"] as const;
export type FaultStatus = (typeof FAULT_STATUSES)[number];

/** Which statuses each status may move to. */
const NEXT: Record<FaultStatus, FaultStatus[]> = {
  open: ["assigned", "in_progress", "cancelled"],
  assigned: ["in_progress", "on_hold", "fixed", "cancelled"],
  in_progress: ["on_hold", "fixed", "cancelled"],
  on_hold: ["in_progress", "fixed", "cancelled"],
  fixed: ["closed", "in_progress"],
  closed: ["in_progress"],
  cancelled: [],
};

/** True when a fault in [from] may move to [to]. */
export const canMove = (from: FaultStatus, to: FaultStatus) => NEXT[from].includes(to);

/** Statuses that still need work. */
export const isOpen = (s: FaultStatus) => s !== "fixed" && s !== "closed" && s !== "cancelled";
