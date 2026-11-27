/**
 * Saved carts in Postgres (table `orders.carts`). Every query filters by the
 * owner's user ID, so a guest can only reach their own row.
 */

import { eq } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { CartRepository } from "../../application/ports/cart-repository";
import type { SavedCart } from "../../domain/saved-cart";
import { carts } from "./schema";

export class DrizzleCartRepository implements CartRepository {
  /** Uses the request's database connection [db]. */
  constructor(private readonly db: Database) {}

  /** The cart saved by [userId], or null. */
  async read(userId: string): Promise<SavedCart | null> {
    // Step 1: find this guest's row only.
    const [row] = await this.db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    // Step 2: no row means no saved cart.
    if (!row) return null;
    return { outlet: row.outlet, lines: row.lines, updatedAt: row.updatedAt };
  }

  /** Saves [cart] for [userId], replacing any earlier one (an upsert). */
  async write(userId: string, cart: SavedCart): Promise<void> {
    await this.db
      .insert(carts)
      .values({ userId, outlet: cart.outlet, lines: cart.lines, updatedAt: cart.updatedAt })
      .onConflictDoUpdate({ target: carts.userId, set: { outlet: cart.outlet, lines: cart.lines, updatedAt: cart.updatedAt } });
  }

  /** Deletes the row of [userId]. */
  async clear(userId: string): Promise<void> {
    await this.db.delete(carts).where(eq(carts.userId, userId));
  }
}
