/**
 * The food numbers on a guest's profile: how many orders they placed and how
 * many dishes they saved. Points come from Points rewards, not from here.
 * Each number counts only the caller's own data.
 */

import type { OrderingDeps } from "../ordering-deps";

/** The food figures for the profile. Each is 0 when there is nothing yet. */
export interface FoodSummary {
  /** Orders placed (any status). */
  orders: number;
  /** Dishes the guest saved (the saved list shows which are still on the menu). */
  savedDishes: number;
}

/** Upper limit on orders read for one profile (a guest's own history). */
const SUMMARY_LIMIT = 1000;

/** The food figures of [userId]. */
export async function foodSummary(deps: OrderingDeps, userId: string): Promise<FoodSummary> {
  // Step 1: the guest's orders and saved dishes, read together.
  const [orders, saved] = await Promise.all([deps.orders.list({ userId, limit: SUMMARY_LIMIT }), deps.savedDishes.list(userId)]);
  // Step 2: the counts.
  return { orders: orders.length, savedDishes: saved.length };
}
