/**
 * Use cases for a guest's saved cart: read it, save it, and clear it after
 * an order. Each works only on the caller's own cart (the user ID comes from
 * the signed-in session, never from the request body).
 */

import type { OrderingDeps } from "../ordering-deps";
import { emptySavedCart, type SavedCart, type SavedCartLine } from "../../domain/saved-cart";

/** The cart [userId] saved, or an empty cart when they have none. */
export async function readSavedCart(deps: OrderingDeps, userId: string): Promise<SavedCart> {
  // Step 1: ask the store for this guest's cart only.
  const saved = await deps.carts.read(userId);
  // Step 2: nothing saved yet means an empty cart.
  return saved ?? emptySavedCart(deps.change.now);
}

/**
 * Replaces [userId]'s saved cart with [lines] from [outlet]. An empty list
 * clears the outlet too, so the next visit starts fresh.
 */
export async function saveCart(deps: OrderingDeps, userId: string, outlet: string | null, lines: SavedCartLine[]): Promise<SavedCart> {
  // Step 1: an empty cart has no outlet.
  const cart: SavedCart = { outlet: lines.length ? outlet : null, lines, updatedAt: deps.change.now };
  // Step 2: store it under this guest's own ID.
  await deps.carts.write(userId, cart);
  return cart;
}

/** Empties [userId]'s saved cart (used after a successful order). */
export async function clearSavedCart(deps: OrderingDeps, userId: string): Promise<void> {
  await deps.carts.clear(userId);
}
