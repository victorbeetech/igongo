/** One step in a fault's history: who moved it from what to what, and why. */

import type { FaultStatus } from "./fault-status";

export interface FaultEvent {
  id: string;
  faultId: string;
  byId: string | null;
  byName: string;
  from: FaultStatus | null;
  to: FaultStatus;
  note: string | null;
  at: Date;
}
