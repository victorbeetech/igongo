/** Everything Delivery & Riders' use cases need, given by the gateway per request. */

import type { OrderTracker } from "@igongo/contracts/food-ordering";
import type { ChangeContext } from "@igongo/core";
import type { JobRepository } from "./ports/job-repository";
import type { RiderRepository } from "./ports/rider-repository";
import type { RulesStore } from "./ports/rules-store";

export interface DeliveryDeps {
  jobs: JobRepository;
  riders: RiderRepository;
  rules: RulesStore;
  /** Food Ordering, through its contract, or null while it is switched off. */
  orders: OrderTracker | null;
  change: ChangeContext;
}
