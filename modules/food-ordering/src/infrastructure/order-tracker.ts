/** Food Ordering's `OrderTracker` contract, for Delivery & Riders. */

import type { OrderTracker } from "@igongo/contracts/food-ordering";
import { AppError } from "@igongo/core";
import type { OrderingDeps } from "../application/ordering-deps";
import { orderOf } from "../application/use-cases/change-order";
import { moveTo, toRef } from "../application/use-cases/order-status";

export function orderTracker(deps: OrderingDeps): OrderTracker {
  return {
    byId: async (id) => {
      const o = await deps.orders.byId(id);
      return o ? toRef(o) : null;
    },
    async advance(id, status) {
      const o = await orderOf(deps, id);
      // Riders only move deliveries: ready to on the way, on the way to delivered.
      const from = status === "on_the_way" ? "ready" : "on_the_way";
      if (o.type !== "delivery" || o.status !== from) throw new AppError("conflict", `Order is ${o.status.replace(/_/g, " ")}.`);
      await moveTo(deps, o, status);
    },
  };
}
