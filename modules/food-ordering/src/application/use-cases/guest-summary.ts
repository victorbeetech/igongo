/**
 * The food numbers on a guest's profile: how many orders they placed, the
 * loyalty points they have earned from delivered food, and how many dishes
 * they saved. Each number counts only the caller's own data.
 */

import { pointsEarned } from "../../domain/points";
import type { OrderingDeps } from "../ordering-deps";

/** The food figures for the profile. Each is 0 when there is nothing yet. */
export interface FoodSummary {
  /** Orders placed (any status). */
  orders: number;
  /** Points earned from delivered food, at the rate in the ordering rules. */
  points: number;
  /** Dishes the guest saved (the saved list shows which are still on the menu). */
  savedDishes: number;
}

/** Upper limit on orders read for one profile (a guest's own history). */
const SUMMARY_LIMIT = 1000;

/** The food figures of [userId]. */
export async function foodSummary(deps: OrderingDeps, userId: string): Promise<FoodSummary> {
  // Step 1: read the guest's orders and the ordering rules (for the points rate).
  const [orders, delivered, rules, saved] = await Promise.all([
    deps.orders.list({ userId, limit: SUMMARY_LIMIT }),
    deps.orders.list({ userId, statuses: ["delivered"], limit: SUMMARY_LIMIT }),
    deps.rules.read(),
    deps.savedDishes.list(userId),
  ]);
  // Step 2: points come from what was spent on delivered orders only.
  const spent = delivered.reduce((sum, o) => sum + o.total, 0);
  // Step 3: the saved count is the number of saved rows.
  return { orders: orders.length, points: pointsEarned(spent, rules.pointsPer1000), savedDishes: saved.length };
}
