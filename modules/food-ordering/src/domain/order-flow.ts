/**
 * Which status an order may move to next. The kitchen moves an order from
 * received to preparing to ready; then a rider takes a delivery on the way
 * and delivers it, and staff hand the rest over (delivered).
 */

import type { OrderStatus, OrderType } from "@igongo/contracts/food-ordering";

/** The next statuses staff may set from [status], for an order of [type]. */
export function nextStatuses(status: OrderStatus, type: OrderType): OrderStatus[] {
  switch (status) {
    case "received":
      return ["preparing"];
    case "preparing":
      return ["ready"];
    // Deliveries leave with a rider (Delivery & Riders moves them on).
    case "ready":
      return type === "delivery" ? [] : ["delivered"];
    default:
      return [];
  }
}

/** True while an order can still be cancelled (before it leaves the kitchen). */
export function cancellable(status: OrderStatus): boolean {
  return status === "awaiting_payment" || status === "received" || status === "preparing" || status === "ready";
}
