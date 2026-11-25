/** Everything Attendance's use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { CardResolver } from "@igongo/contracts/staff-cards";
import type { ChangeContext } from "@igongo/core";
import type { ClockEventRepository } from "./ports/clock-event-repository";
import type { RulesStore } from "./ports/rules-store";

export interface AttendanceDeps {
  events: ClockEventRepository;
  rules: RulesStore;
  /** HR Records, through its contract. */
  staff: StaffDirectory;
  /** Staff Cards, through its contract. */
  cards: CardResolver;
  change: ChangeContext;
}
