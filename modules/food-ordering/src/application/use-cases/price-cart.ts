/**
 * Use case: price a cart and estimate its ready time without saving it
 * (S62-04 cart, S62-06 pre-order). Placing an order uses the same steps:
 *   1. the order type must be on at this outlet,
 *   2. every item must exist, be at this outlet and be available today,
 *   3. each line is priced with its options,
 *   4. a delivery gets its zone's fee,
 *   5. a pre-order's arrival time needs enough notice for the slowest item,
 *   6. the ready time comes from prep times and the kitchen's queue.
 */

import type { DeliveryPlace, OrderType } from "@igongo/contracts/food-ordering";
import { AppError } from "@igongo/core";
import type { OrderLine } from "../../domain/order-line";
import { readyTime, typeAllowed, type OrderingRules } from "../../domain/ordering-rules";
import { priceLine } from "../../domain/price-line";
import type { OrderingDeps } from "../ordering-deps";

export interface CartInput {
  outlet: string;
  type: OrderType;
  lines: { itemId: string; quantity: number; options: string[]; notes?: string }[];
  arriveAt?: Date;
  deliverTo?: DeliveryPlace;
}

export interface PricedCart {
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  readyAt: Date;
  rules: OrderingRules;
}

export async function priceCart(deps: OrderingDeps, cart: CartInput): Promise<PricedCart> {
  const now = deps.change.now;
  const rules = await deps.rules.read();
  // 1. Type and outlet.
  if (!(await deps.menu.outlet(cart.outlet))) throw new AppError("not_found", "That outlet was not found.");
  if (!typeAllowed(rules, cart.type, cart.outlet)) throw new AppError("method_disabled", `${cart.type.replace(/_/g, " ")} orders are not taken at this outlet.`);
  // 2. Items.
  const items = new Map((await deps.menu.items(cart.lines.map((l) => l.itemId))).map((i) => [i.itemId, i]));
  const lines = cart.lines.map((l) => {
    const item = items.get(l.itemId);
    if (!item || item.outlet !== cart.outlet) throw new AppError("not_found", "An item in the cart is not on this menu.");
    if (!item.available) throw new AppError("conflict", `${item.name} is not available today.`);
    // 3. Price.
    return priceLine(item, l.quantity, l.options, l.notes ?? null);
  });
  // 4. Delivery fee.
  let deliveryFee = 0;
  if (cart.type === "delivery") {
    if (!deps.delivery) throw new AppError("module_disabled", "Delivery is switched off for now.");
    if (!cart.deliverTo?.zone) throw new AppError("bad_request", "Choose where to deliver.");
    const quote = await deps.delivery.quote(cart.deliverTo.zone);
    if (!quote) throw new AppError("bad_request", "We don't deliver to that area.");
    deliveryFee = quote.fee;
  }
  // 5. Pre-order notice.
  const prep = cart.lines.map((l) => items.get(l.itemId)?.prepMinutes ?? 0);
  if (cart.type === "pre_order") {
    if (!cart.arriveAt) throw new AppError("bad_request", "Choose your arrival time.");
    const notice = Math.max(rules.preorderMinNoticeMinutes, ...prep);
    if (cart.arriveAt.getTime() < now.getTime() + notice * 60_000) throw new AppError("bad_request", `Pre-orders need at least ${notice} minutes' notice.`);
  }
  // 6. Ready time.
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const readyAt = readyTime({ now, prepMinutes: prep, queued: await deps.orders.queued(cart.outlet), arriveAt: cart.type === "pre_order" ? (cart.arriveAt ?? null) : null, rules });
  return { lines, subtotal, deliveryFee, total: subtotal + deliveryFee, readyAt, rules };
}
