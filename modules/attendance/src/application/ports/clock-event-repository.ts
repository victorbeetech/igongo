/** Where clock events are kept. The Drizzle version is in infrastructure/db. */

import type { ClockEvent } from "../../domain/clock-event";

/** Which events to read. Dates are hotel days, `YYYY-MM-DD`, both ends included. */
export interface ClockEventFilter {
  from: string;
  to: string;
  staffId?: string;
  department?: string;
}

export interface ClockEventRepository {
  add(event: ClockEvent): Promise<void>;
  /** The person's most recent event, or null. */
  latestFor(staffId: string): Promise<ClockEvent | null>;
  /** True when the person already has an "in" on [workDate] (so the next one is not late). */
  hasInOn(staffId: string, workDate: string): Promise<boolean>;
  list(filter: ClockEventFilter): Promise<ClockEvent[]>;
}
