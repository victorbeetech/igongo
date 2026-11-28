/**
 * The food numbers on a guest's profile: how many orders they placed. Points
 * come from Points rewards, not from here. The count only includes the
 * caller's own orders.
 */

import type { OrderingDeps } from "../ordering-deps";

/** The food figures for the profile. The count is 0 when there is nothing yet. */
export interface FoodSummary {
  /** Orders placed (any status). */
  orders: number;
}

/** Upper limit on orders read for one profile (a guest's own history). */
const SUMMARY_LIMIT = 1000;

/** The food figures of [userId]. */
export async function foodSummary(deps: OrderingDeps, userId: string): Promise<FoodSummary> {
  // Step 1: read the guest's own orders, up to the limit.
  const orders = await deps.orders.list({ userId, limit: SUMMARY_LIMIT });
  // Step 2: the count is all the profile needs.
  return { orders: orders.length };
}
