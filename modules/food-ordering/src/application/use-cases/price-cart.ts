/**
 * Use case: price a cart and estimate its ready time without saving it
 * (S62-04 cart, S62-06 pre-order). Placing an order uses the same steps,
 * so every price and total is always worked out here, on the server:
 *   1. the order type must be on at this outlet,
 *   2. every item must exist, be at this outlet and be available today,
 *   3. each line is priced with its options,
 *   4. a delivery gets its zone's fee and travel time,
 *   4b. a takeaway adds the container fee the super admin set (0 = free),
 *   5. a promo or voucher code takes its discount off the food,
 *   6. a pre-order or scheduled order needs enough notice, within the days allowed,
 *   7. the ready time comes from prep times and the kitchen's queue.
 */

import type { DeliveryPlace, OrderType } from "@igongo/contracts/food-ordering";
import type { PromoQuote } from "@igongo/contracts/promotions-vouchers";
import { AppError } from "@igongo/core";
import type { OrderLine } from "../../domain/order-line";
import { checkLineDay } from "../../domain/line-day";
import { readyTime, SCHEDULABLE_TYPES, typeAllowed, type OrderingRules } from "../../domain/ordering-rules";
import { priceLine } from "../../domain/price-line";
import type { OrderingDeps } from "../ordering-deps";

export interface CartInput {
  outlet: string;
  type: OrderType;
  lines: { itemId: string; quantity: number; options: string[]; notes?: string; date?: string }[];
  /** Arrival (pre-order) or the wanted time (scheduled order). */
  arriveAt?: Date;
  deliverTo?: DeliveryPlace;
  promoCode?: string;
}

export interface PricedCart {
  lines: OrderLine[];
  subtotal: number;
  /** The code's discount, or null when no code was given. */
  promo: PromoQuote | null;
  discount: number;
  deliveryFee: number;
  /** The takeaway container fee the super admin set (0 = free). */
  containerFee: number;
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
    // 3. Price, and the day the guest wants it (the hotel's day, checked).
    if (l.date) checkLineDay(l.date, now);
    return { ...priceLine(item, l.quantity, l.options, l.notes ?? null), date: l.date ?? null };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  // 4. Delivery fee and travel time.
  let deliveryFee = 0;
  let travelMinutes = 0;
  if (cart.type === "delivery") {
    if (!deps.delivery) throw new AppError("module_disabled", "Delivery is switched off for now.");
    if (!cart.deliverTo?.zone) throw new AppError("bad_request", "Choose where to deliver.");
    const quote = await deps.delivery.quote(cart.deliverTo.zone);
    if (!quote) throw new AppError("bad_request", "We don't deliver to that area.");
    deliveryFee = quote.fee;
    travelMinutes = quote.minutes;
  }
  // 4b. Takeaway containers: free unless the super admin set a fee.
  const containerFee = cart.type === "takeaway" ? Math.max(0, rules.containerFee) : 0;
  // 5. Promo or voucher: never more than the food (the delivery fee is always paid).
  let promo: PromoQuote | null = null;
  if (cart.promoCode) {
    if (!deps.promos) throw new AppError("module_disabled", "Promo codes are switched off for now.");
    promo = await deps.promos.check(cart.promoCode, { module: "food-ordering", outlet: cart.outlet, subtotal });
    if (!promo) throw new AppError("bad_request", "That code does not work here, or it has ended.");
  }
  const discount = Math.min(subtotal, Math.max(0, promo?.discount ?? 0));
  // 6. The guest's time: notice and how far ahead.
  const prep = cart.lines.map((l) => items.get(l.itemId)?.prepMinutes ?? 0);
  const scheduled = cart.type === "pre_order" || (!!cart.arriveAt && SCHEDULABLE_TYPES.includes(cart.type));
  if (cart.type === "pre_order" && !cart.arriveAt) throw new AppError("bad_request", "Choose your arrival time.");
  if (cart.arriveAt && !scheduled) throw new AppError("bad_request", `${cart.type.replace(/_/g, " ")} orders cannot be scheduled.`);
  if (scheduled && cart.arriveAt) {
    if (cart.type !== "pre_order" && rules.scheduleAheadDays === 0) throw new AppError("method_disabled", "Scheduled orders are switched off.");
    const base = cart.type === "pre_order" ? rules.preorderMinNoticeMinutes : 0;
    const notice = Math.max(base, ...prep) + travelMinutes;
    if (cart.arriveAt.getTime() < now.getTime() + notice * 60_000) throw new AppError("bad_request", `${cart.type === "pre_order" ? "Pre-orders" : "Scheduled orders"} need at least ${notice} minutes' notice.`);
    const days = Math.max(rules.scheduleAheadDays, 1);
    if (cart.arriveAt.getTime() > now.getTime() + days * 86_400_000) throw new AppError("bad_request", `Orders can be scheduled up to ${days} days ahead.`);
  }
  // 7. Ready time.
  const readyAt = readyTime({ now, prepMinutes: prep, queued: await deps.orders.queued(cart.outlet), arriveAt: scheduled ? (cart.arriveAt ?? null) : null, travelMinutes, rules });
  return { lines, subtotal, promo, discount, deliveryFee, containerFee, total: subtotal - discount + deliveryFee + containerFee, readyAt, rules };
}
