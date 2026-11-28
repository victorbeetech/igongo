/**
 * Use cases that move an order on:
 *   - advanceOrder: the kitchen or front of house sets the next status (S62-12);
 *   - cancelOrder: the guest within the cancel window, or staff, before it
 *     leaves the kitchen, with a reason;
 *   - recordOrderPayment: Payments says money came in; the order goes to
 *     the kitchen once enough is paid.
 */

import type { OrderStatus } from "@igongo/contracts/food-ordering";
import { AppError } from "@igongo/core";
import type { Order } from "../../domain/order";
import { cancellable, nextStatuses } from "../../domain/order-flow";
import { paidBeforeKitchen } from "../../domain/ordering-rules";
import type { OrderingDeps } from "../ordering-deps";
import { moveTo } from "./order-status";

/** The order [id]. @throws AppError not_found */
export async function orderOf(deps: OrderingDeps, id: string): Promise<Order> {
  const order = await deps.orders.byId(id);
  if (!order) throw new AppError("not_found", "Order not found.");
  return order;
}

export async function advanceOrder(deps: OrderingDeps, id: string, status: OrderStatus): Promise<Order> {
  const order = await orderOf(deps, id);
  if (!nextStatuses(order.status, order.type).includes(status)) throw new AppError("conflict", `An order that is ${order.status.replace(/_/g, " ")} cannot become ${status.replace(/_/g, " ")}.`);
  return moveTo(deps, order, status);
}

export async function cancelOrder(deps: OrderingDeps, id: string, by: { userId: string; staff: boolean }, reason: string): Promise<Order> {
  const order = await orderOf(deps, id);
  if (!by.staff) {
    if (order.userId !== by.userId) throw new AppError("permission_denied", "This order is not yours.");
    const window = (await deps.rules.read()).cancelWindowMinutes * 60_000;
    // Guests may cancel only before the kitchen starts and within the window.
    if (order.status === "preparing" || order.status === "ready" || deps.change.now.getTime() - order.createdAt.getTime() > window) {
      throw new AppError("conflict", "It is too late to cancel this order here. Please call the restaurant.");
    }
  }
  if (!cancellable(order.status)) throw new AppError("conflict", "This order can no longer be cancelled.");
  // Money already paid is refunded by Payments staff; the note says so.
  const cancelled = await moveTo(deps, order, "cancelled", order.paid > 0 ? `${reason} (refund ${order.paid} UGX)` : reason);
  // Points come back: spent ones returned, earned ones taken back (once per order).
  if (deps.points && order.userId) await deps.points.reverse(order.userId, order.id);
  return cancelled;
}

export async function recordOrderPayment(deps: OrderingDeps, id: string, amount: number): Promise<void> {
  const order = await orderOf(deps, id);
  const paid: Order = { ...order, paid: order.paid + amount, updatedAt: deps.change.now };
  await deps.orders.update(paid);
  const needed = paidBeforeKitchen(await deps.rules.read(), order.type, order.total);
  if (order.status === "awaiting_payment" && paid.paid >= needed) await moveTo(deps, paid, "received", `Paid ${paid.paid} UGX`);
  // Earn points once the order is paid in full (a guest's order only; once per order).
  if (deps.points && order.userId && paid.paid >= order.total) await deps.points.earn(order.userId, order.total, order.id);
}
