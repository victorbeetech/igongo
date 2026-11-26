/** Everything Advances & Loans' use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { AdvanceRepository } from "./ports/advance-repository";
import type { AdvanceRulesStore } from "./ports/rules-store";

export interface AdvancesDeps {
  advances: AdvanceRepository;
  rules: AdvanceRulesStore;
  staff: StaffDirectory;
  change: ChangeContext;
}
