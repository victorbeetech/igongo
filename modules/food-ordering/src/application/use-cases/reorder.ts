/**
 * Use case: order again (reorder). Takes a past order of the guest's own,
 * keeps the lines whose dishes are still on the menu and available today,
 * and prices them again at today's prices (never the old ones). The app
 * fills the cart with the result; nothing is saved until the guest checks out.
 */

import type { OrderType } from "@igongo/contracts/food-ordering";
import { AppError, omitKey } from "@igongo/core";
import type { OrderingDeps } from "../ordering-deps";
import { orderOf } from "./change-order";
import { priceCart, type PricedCart } from "./price-cart";

export interface ReorderResult {
  outlet: string;
  /** The order type to repeat it as (a pre-order or table order comes back as a takeaway). */
  type: OrderType;
  /** The cart lines to put back, as the app sends them to checkout. */
  lines: { itemId: string; quantity: number; options: string[]; notes?: string }[];
  /** Names of dishes left out because they are off the menu or sold out today. */
  missing: string[];
  /** Today's price of what is left, or null when nothing is left. */
  quote: Omit<PricedCart, "rules"> | null;
}

export async function reorder(deps: OrderingDeps, id: string, userId: string): Promise<ReorderResult> {
  const order = await orderOf(deps, id);
  if (order.userId !== userId) throw new AppError("permission_denied", "You can only reorder your own orders.");
  // 1. Which dishes can still be had today.
  const items = new Map((await deps.menu.items(order.lines.map((l) => l.itemId))).map((i) => [i.itemId, i]));
  const keep = order.lines.filter((l) => items.get(l.itemId)?.available && items.get(l.itemId)?.outlet === order.outlet);
  const lines = keep.map((l) => ({ itemId: l.itemId, quantity: l.quantity, options: l.options.map((o) => `${o.group}:${o.key}`), ...(l.notes ? { notes: l.notes } : {}) }));
  const missing = order.lines.filter((l) => !keep.includes(l)).map((l) => l.name);
  // 2. Today's price. A pre-order or table order comes back as a takeaway (its time or table can't be copied).
  if (!lines.length) return { outlet: order.outlet, type: order.type, lines, missing, quote: null };
  const type = order.type === "pre_order" || order.type === "dine_in" ? "takeaway" : order.type;
  try {
    const priced = await priceCart(deps, { outlet: order.outlet, type, lines, ...(type === "delivery" && order.deliverTo ? { deliverTo: order.deliverTo } : {}) });
    return { outlet: order.outlet, type, lines, missing, quote: omitKey(priced, "rules") };
  } catch (error) {
    // An option that changed since makes the old choice invalid: drop to no quote, the app asks again.
    if (error instanceof AppError) return { outlet: order.outlet, type, lines, missing, quote: null };
    throw error;
  }
}
