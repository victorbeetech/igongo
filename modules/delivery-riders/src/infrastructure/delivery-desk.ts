/** Delivery & Riders' `DeliveryDesk` contract, for Food Ordering. */

import type { DeliveryDesk } from "@igongo/contracts/delivery-riders";
import type { DeliveryDeps } from "../application/delivery-deps";
import { openJob } from "../application/use-cases/open-job";

export function deliveryDesk(deps: DeliveryDeps): DeliveryDesk {
  return {
    quote: async (zone) => (await deps.rules.read()).zones.find((z) => z.zone === zone) ?? null,
    open: async (order) => void (await openJob(deps, order)),
  };
}
