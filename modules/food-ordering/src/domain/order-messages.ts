/**
 * The push a guest gets as their order moves (order status push). Only
 * the steps a guest cares about send one; the link opens the order in the
 * app. Deliveries on the road are told by Delivery & Riders instead.
 */

import type { OrderStatus } from "@igongo/contracts/food-ordering";
import type { UserMessage } from "@igongo/contracts/notifications";
import { orderNumber, type Order } from "./order";

/** The words for each status a guest is told about. */
const WORDS: Partial<Record<OrderStatus, (o: Order) => string>> = {
  received: (o) => `${orderNumber(o.seq)} is with the kitchen.`,
  preparing: (o) => `The kitchen is cooking ${orderNumber(o.seq)}.`,
  ready: (o) => (o.type === "delivery" ? `${orderNumber(o.seq)} is ready and waiting for a rider.` : `${orderNumber(o.seq)} is ready.`),
  delivered: (o) => (o.type === "delivery" ? "" : `${orderNumber(o.seq)} was served. Enjoy!`),
  cancelled: (o) => `${orderNumber(o.seq)} was cancelled.`,
};

/** The push for [order] reaching [status], or null when there is nothing to say. */
export function statusMessage(order: Order, status: OrderStatus): UserMessage | null {
  const body = WORDS[status]?.(order);
  if (!body) return null;
  return { title: "Your order", body, channel: status === "cancelled" ? "urgent" : "bookings", link: `/orders/${order.id}` };
}
