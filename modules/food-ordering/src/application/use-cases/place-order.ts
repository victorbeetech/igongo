/**
 * Use case: place an order (S62-08, S62-09), by a guest in the app or by
 * staff for a phone, walk-in or table order (S62-14, S62-15). Steps:
 *   1. price the cart (all the checks in price-cart.ts),
 *   2. decide where it starts: waiting for payment (full or deposit) or
 *      straight to the kitchen,
 *   3. give it the next ticket number and save it,
 *   4. record it.
 */

import { newId, recordChange } from "@igongo/core";
import { orderNumber, type Order, type OrderChannel } from "../../domain/order";
import { paidBeforeKitchen } from "../../domain/ordering-rules";
import type { OrderingDeps } from "../ordering-deps";
import { priceCart, type CartInput } from "./price-cart";

export interface PlaceInput extends CartInput {
  customer: { userId: string | null; name: string; phone: string | null };
  channel: OrderChannel;
  notes?: string;
  allergies?: string;
  table?: string;
}

export async function placeOrder(deps: OrderingDeps, input: PlaceInput): Promise<Order> {
  const now = deps.change.now;
  // 1. Price and check.
  const cart = await priceCart(deps, input);
  // 2. Kitchen now, or after payment.
  const status = paidBeforeKitchen(cart.rules, input.type, cart.total) > 0 ? "awaiting_payment" : "received";
  // 3. Number and save.
  const order: Order = {
    id: newId("ord"), seq: await deps.orders.nextSeq(), userId: input.customer.userId, customerName: input.customer.name, customerPhone: input.customer.phone,
    outlet: input.outlet, type: input.type, channel: input.channel, status, lines: cart.lines, notes: input.notes ?? null, allergies: input.allergies ?? null,
    table: input.table ?? null, deliverTo: input.deliverTo ?? null, subtotal: cart.subtotal, deliveryFee: cart.deliveryFee, total: cart.total, paid: 0,
    arriveAt: input.arriveAt ?? null, readyAt: cart.readyAt, takenBy: input.channel === "staff" ? deps.change.actorId : null,
    history: [{ status, at: now.toISOString(), by: deps.change.actorId, note: null }], createdAt: now, updatedAt: now,
  };
  await deps.orders.add(order);
  // 4. Record.
  await recordChange(deps.change, { module: "food-ordering", action: "order.placed", recordType: "order", recordId: order.id, summary: `Order ${orderNumber(order.seq)} (${order.type.replace(/_/g, " ")}) for ${order.customerName}: ${order.total} UGX` });
  return order;
}
