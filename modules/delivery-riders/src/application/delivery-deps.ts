/** Everything Delivery & Riders' use cases need, given by the gateway per request. */

import type { DeliverySource, SourceTracker } from "@igongo/contracts/delivery-riders";
import type { UserNotifier } from "@igongo/contracts/notifications";
import type { ChangeContext } from "@igongo/core";
import type { JobRepository } from "./ports/job-repository";
import type { RiderRepository } from "./ports/rider-repository";
import type { RulesStore } from "./ports/rules-store";

export interface DeliveryDeps {
  jobs: JobRepository;
  riders: RiderRepository;
  rules: RulesStore;
  /**
   * The modules deliveries come from, through their contracts, so a pick-up
   * or hand-over moves the record on there too (food: the order goes "on the
   * way", then "delivered"). A source that is missing or switched off is
   * left out; its deliveries still work here.
   */
  trackers: Partial<Record<DeliverySource, SourceTracker>>;
  /** Pushes to the guest and the rider (Notifications), or nothing when it is not set up. */
  notify: UserNotifier;
  change: ChangeContext;
}
