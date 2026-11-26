/** Everything Bonuses & Rewards' use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { CardResolver } from "@igongo/contracts/staff-cards";
import type { ChangeContext } from "@igongo/core";
import type { BonusRepository } from "./ports/bonus-repository";
import type { BonusRulesStore } from "./ports/rules-store";

export interface BonusesDeps {
  bonuses: BonusRepository;
  rules: BonusRulesStore;
  staff: StaffDirectory;
  /** Finds the staff member from a tapped card at the buffet. */
  cards: CardResolver;
  change: ChangeContext;
}
