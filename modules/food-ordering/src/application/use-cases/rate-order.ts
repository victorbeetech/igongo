/**
 * Use cases for ratings and reviews (S62-11):
 *   - rateOrder: the guest who ordered rates a delivered order once:
 *     food stars, delivery stars (deliveries only) and a short review;
 *   - hideReview: staff hide or show a review that breaks the rules.
 */

import { AppError, recordChange } from "@igongo/core";
import { orderNumber } from "../../domain/order";
import { firstName, type OrderRating } from "../../domain/order-rating";
import type { OrderingDeps } from "../ordering-deps";
import { orderOf } from "./change-order";

export interface RateInput {
  food: number;
  delivery?: number;
  comment?: string;
}

export async function rateOrder(deps: OrderingDeps, id: string, by: { userId: string; name: string }, input: RateInput): Promise<OrderRating> {
  // 1. Only the guest's own, finished order, once.
  const order = await orderOf(deps, id);
  if (order.userId !== by.userId) throw new AppError("permission_denied", "You can only rate your own orders.");
  if (order.status !== "delivered") throw new AppError("conflict", "You can rate an order once it has reached you.");
  if (await deps.ratings.byOrder(id)) throw new AppError("conflict", "You already rated this order.");
  // 2. Delivery stars only make sense for a delivery.
  const rating: OrderRating = {
    orderId: id, userId: by.userId, name: firstName(by.name), outlet: order.outlet, itemIds: [...new Set(order.lines.map((l) => l.itemId))],
    food: input.food, delivery: order.type === "delivery" ? (input.delivery ?? null) : null, comment: input.comment ?? null, hidden: false, createdAt: deps.change.now,
  };
  await deps.ratings.add(rating);
  await recordChange(deps.change, { module: "food-ordering", action: "order.rated", recordType: "order", recordId: id, summary: `Order ${orderNumber(order.seq)} rated ${rating.food}/5` });
  return rating;
}

export async function hideReview(deps: OrderingDeps, id: string, hidden: boolean): Promise<void> {
  if (!(await deps.ratings.byOrder(id))) throw new AppError("not_found", "Review not found.");
  await deps.ratings.setHidden(id, hidden);
  await recordChange(deps.change, { module: "food-ordering", action: hidden ? "review.hidden" : "review.shown", recordType: "order", recordId: id, summary: `${hidden ? "Hid" : "Showed"} the review of order ${id}` });
}
