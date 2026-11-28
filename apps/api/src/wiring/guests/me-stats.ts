/**
 * The profile numbers of the signed-in guest (`GET /api/me/stats`): bookings
 * across the booking modules, orders, loyalty points (Points rewards) and saved dishes. Each
 * number counts only the caller's own data (the user ID comes from the
 * session). A module the super admin switched off contributes 0.
 */

import { foodSummary } from "@igongo/food-ordering";
import { walletFor } from "@igongo/points-rewards";
import { actorOf, requireSignIn, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import { BOOKING_MODULES, type BookingModuleKey, type GuestServices } from "./guest-services";

/** The figures on the profile, as the app shows them. */
export interface ProfileStats {
  /** Bookings not cancelled, across every booking module that is on. */
  bookings: number;
  /** Food orders placed. */
  orders: number;
  /** Spendable loyalty points (Points rewards). */
  points: number;
  /** Dishes on the saved list. */
  savedDishes: number;
}

/** The booking modules' counts for [userId]: bookings that are not cancelled, module by module. */
async function bookingCount(services: GuestServices, userId: string): Promise<number> {
  // Step 1: go through each booking module the super admin has on.
  let total = 0;
  for (const key of Object.keys(BOOKING_MODULES) as BookingModuleKey[]) {
    if (!(await services.isOn(key))) continue;
    // Step 2: this guest's bookings in that module (their own only, by user ID).
    const list = await services.booking(key).bookings.list({ userId, limit: 200 });
    // Step 3: cancelled bookings do not count.
    total += list.filter((b) => b.status !== "cancelled").length;
  }
  return total;
}

/** Every profile figure of [userId]. */
export async function profileStats(services: GuestServices, userId: string): Promise<ProfileStats> {
  // Step 1: food figures only while Food Ordering is on.
  const food = (await services.isOn("food-ordering")) ? await foodSummary(services.ordering(), userId) : { orders: 0, savedDishes: 0 };
  // Step 2: bookings across the booking modules.
  const bookings = await bookingCount(services, userId);
  // Step 3: the spendable points balance from Points rewards (0 while the programme is off).
  const wallet = await walletFor(services.points(), userId, new Date());
  const points = wallet.enabled ? wallet.balance : 0;
  // Step 4: one answer with all four numbers.
  return { bookings, orders: food.orders, points, savedDishes: food.savedDishes };
}

/** The `/api/me` routes: the signed-in guest's own profile numbers. */
export function meRouter(services: (c: Context<ActorEnv>) => GuestServices) {
  return new Hono<ActorEnv>().get("/stats", requireSignIn, async (c) => c.json(await profileStats(services(c), actorOf(c).userId)));
}
