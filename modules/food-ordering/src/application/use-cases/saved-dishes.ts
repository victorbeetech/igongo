/**
 * Use cases for a guest's saved dishes: list them with today's names and
 * prices from the menu, save a dish, and remove one. Each works only on the
 * caller's own list (the user ID comes from the signed-in session).
 */

import { AppError } from "@igongo/core";
import type { SavedDish } from "../../domain/saved-dish";
import type { OrderingDeps } from "../ordering-deps";

/**
 * The guest's saved dishes, with each dish's current name, price and
 * availability. A dish that has left the menu is left out of the list.
 */
export async function listSavedDishes(deps: OrderingDeps, userId: string): Promise<SavedDish[]> {
  // Step 1: the guest's own rows, newest first.
  const rows = await deps.savedDishes.list(userId);
  if (rows.length === 0) return [];
  // Step 2: read today's menu entries for those dishes in one call.
  const items = await deps.menu.items(rows.map((r) => r.itemId));
  const byId = new Map(items.map((i) => [i.itemId, i]));
  // Step 3: keep the saved order and drop dishes that are no longer on the menu.
  return rows.flatMap((r) => {
    const item = byId.get(r.itemId);
    return item ? [{ itemId: item.itemId, outlet: item.outlet, name: item.name, price: item.price, available: item.available, savedAt: r.savedAt }] : [];
  });
}

/**
 * Saves dish [itemId] for [userId]. @throws AppError not_found when the dish
 * is not on the menu (so nobody can save an ID that is not a real dish).
 */
export async function saveDish(deps: OrderingDeps, userId: string, itemId: string): Promise<void> {
  // Step 1: the dish must exist on the menu; its outlet is stored with it.
  const [item] = await deps.menu.items([itemId]);
  if (!item) throw new AppError("not_found", "That dish is not on the menu.");
  // Step 2: store it under the guest's own ID, stamped with the server's time.
  await deps.savedDishes.save({ userId, itemId: item.itemId, outlet: item.outlet, savedAt: deps.change.now });
}

/** Removes dish [itemId] from [userId]'s saved dishes (no error when it was not saved). */
export async function removeDish(deps: OrderingDeps, userId: string, itemId: string): Promise<void> {
  await deps.savedDishes.remove(userId, itemId);
}
