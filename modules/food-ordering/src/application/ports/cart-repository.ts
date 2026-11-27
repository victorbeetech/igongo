/**
 * Port: where guests' saved carts are kept. Every method takes the owner's
 * user ID, so one guest's cart can never be read or changed through another's.
 */

import type { SavedCart } from "../../domain/saved-cart";

export interface CartRepository {
  /** The cart saved by [userId], or null when they have none. */
  read(userId: string): Promise<SavedCart | null>;
  /** Replaces the cart of [userId] with [cart]. */
  write(userId: string, cart: SavedCart): Promise<void>;
  /** Removes the cart of [userId] (after an order, or when they empty it). */
  clear(userId: string): Promise<void>;
}
