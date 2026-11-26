/** Moves an order to a new status and writes the step into its timeline. Shared by the use cases. */

import type { OrderStatus } from "@igongo/contracts/food-ordering";
import { recordChange } from "@igongo/core";
import { orderNumber, type Order } from "../../domain/order";
import type { OrderingDeps } from "../ordering-deps";

/** Saves [order] as [status], with [note], and records it. */
export async function moveTo(deps: OrderingDeps, order: Order, status: OrderStatus, note: string | null = null): Promise<Order> {
  const now = deps.change.now;
  const moved: Order = { ...order, status, updatedAt: now, history: [...order.history, { status, at: now.toISOString(), by: deps.change.actorId, note }] };
  await deps.orders.update(moved);
  await recordChange(deps.change, { module: "food-ordering", action: `order.${status}`, recordType: "order", recordId: order.id, summary: `Order ${orderNumber(order.seq)} is ${status.replace(/_/g, " ")}${note ? `: ${note}` : ""}` });
  // A delivery that is ready goes to the riders.
  if (status === "ready" && moved.type === "delivery") await deps.delivery?.open(toRef(moved));
  return moved;
}

/** The order as other modules see it (the contract shape). */
export function toRef(o: Order) {
  return { orderId: o.id, number: orderNumber(o.seq), userId: o.userId, customerName: o.customerName, customerPhone: o.customerPhone, outlet: o.outlet, type: o.type, status: o.status, total: o.total, paid: o.paid, deliverTo: o.deliverTo };
}
