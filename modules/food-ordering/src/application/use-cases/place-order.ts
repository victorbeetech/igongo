/**
 * Use case: place an order (S62-08, S62-09), by a guest in the app or by
 * staff for a phone, walk-in or table order (S62-14, S62-15). Steps:
 *   0. a checkout key already used by this person returns that order
 *      (a double tap never orders twice),
 *   1. price the cart (all the checks in price-cart.ts),
 *   2. decide where it starts: waiting for payment (full or deposit) or
 *      straight to the kitchen,
 *   3. give it the next ticket number and save it,
 *   4. use up the voucher and record it,
 *   5. a guest's order empties their saved cart.
 */

import { newId, recordChange } from "@igongo/core";
import { orderNumber, type Order, type OrderChannel } from "../../domain/order";
import { paidBeforeKitchen } from "../../domain/ordering-rules";
import type { OrderingDeps } from "../ordering-deps";
import { priceCart, type CartInput } from "./price-cart";
import { clearSavedCart } from "./guest-cart";

export interface PlaceInput extends CartInput {
  customer: { userId: string | null; name: string; phone: string | null };
  channel: OrderChannel;
  notes?: string;
  allergies?: string;
  table?: string;
  /** The app's one-per-checkout key (double-tap guard). */
  requestKey?: string;
}

export async function placeOrder(deps: OrderingDeps, input: PlaceInput): Promise<Order> {
  const now = deps.change.now;
  // 0. Same checkout again: the same order.
  const key = input.customer.userId && input.requestKey ? input.requestKey : null;
  if (key && input.customer.userId) {
    const again = await deps.orders.byRequestKey(input.customer.userId, key);
    if (again) return again;
  }
  // 1. Price and check.
  const cart = await priceCart(deps, input);
  // 2. Kitchen now, or after payment.
  const status = paidBeforeKitchen(cart.rules, input.type, cart.total) > 0 ? "awaiting_payment" : "received";
  // 3. Number and save.
  const order: Order = {
    id: newId("ord"), seq: await deps.orders.nextSeq(), userId: input.customer.userId, customerName: input.customer.name, customerPhone: input.customer.phone,
    outlet: input.outlet, type: input.type, channel: input.channel, status, lines: cart.lines, notes: input.notes ?? null, allergies: input.allergies ?? null,
    table: input.table ?? null, deliverTo: input.deliverTo ?? null, subtotal: cart.subtotal, discount: cart.discount, promoCode: cart.promo?.code ?? null,
    deliveryFee: cart.deliveryFee, containerFee: cart.containerFee, total: cart.total, paid: 0, arriveAt: input.arriveAt ?? null, readyAt: cart.readyAt,
    takenBy: input.channel === "staff" ? deps.change.actorId : null, requestKey: key,
    history: [{ status, at: now.toISOString(), by: deps.change.actorId, note: null }], createdAt: now, updatedAt: now,
  };
  await deps.orders.add(order);
  // 4. Voucher and record.
  if (cart.promo) await deps.promos?.redeem(cart.promo.code, order.id);
  // 5. The guest's saved cart is now an order: empty it (staff orders never touch a guest's cart).
  if (input.channel === "app" && input.customer.userId) await clearSavedCart(deps, input.customer.userId);
  await recordChange(deps.change, { module: "food-ordering", action: "order.placed", recordType: "order", recordId: order.id, summary: `Order ${orderNumber(order.seq)} (${order.type.replace(/_/g, " ")}) for ${order.customerName}: ${order.total} UGX${order.promoCode ? ` with ${order.promoCode}` : ""}` });
  return order;
}
