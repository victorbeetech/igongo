/**
 * An in-memory saved-cart store for tests: a Map keyed by the owner's user
 * ID, which is the same rule the Postgres store follows.
 */

import type { CartRepository } from "../../src/application/ports/cart-repository";
import type { SavedCart } from "../../src/domain/saved-cart";

export class MemoryCartRepository implements CartRepository {
  /** The carts, by owner user ID. */
  readonly rows = new Map<string, SavedCart>();

  /** The cart saved by [userId], or null. */
  async read(userId: string): Promise<SavedCart | null> {
    return this.rows.get(userId) ?? null;
  }

  /** Stores [cart] under [userId]. */
  async write(userId: string, cart: SavedCart): Promise<void> {
    this.rows.set(userId, cart);
  }

  /** Removes [userId]'s cart. */
  async clear(userId: string): Promise<void> {
    this.rows.delete(userId);
  }
}
