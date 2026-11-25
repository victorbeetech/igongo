/** Everything Staff Meals' use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { CardResolver } from "@igongo/contracts/staff-cards";
import type { ChangeContext } from "@igongo/core";
import type { ClaimRepository } from "./ports/claim-repository";
import type { MealRulesStore } from "./ports/meal-rules-store";

export interface MealsDeps {
  claims: ClaimRepository;
  rules: MealRulesStore;
  staff: StaffDirectory;
  cards: CardResolver;
  change: ChangeContext;
}
