/** `RatingRepository` on Postgres, with Drizzle. Every value goes in as a bound parameter. */

import type { Database } from "@igongo/core";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { RatingRepository } from "../../application/ports/rating-repository";
import type { ItemStars, OrderRating } from "../../domain/order-rating";
import { ratings } from "./schema";

export class DrizzleRatingRepository implements RatingRepository {
  constructor(private readonly db: Database) {}

  async byOrder(orderId: string): Promise<OrderRating | null> {
    const [row] = await this.db.select().from(ratings).where(eq(ratings.orderId, orderId));
    return row ?? null;
  }

  async ratedAmong(orderIds: string[]): Promise<Set<string>> {
    if (!orderIds.length) return new Set();
    const rows = await this.db.select({ id: ratings.orderId }).from(ratings).where(inArray(ratings.orderId, orderIds));
    return new Set(rows.map((r) => r.id));
  }

  async add(rating: OrderRating): Promise<void> {
    await this.db.insert(ratings).values(rating);
  }

  list(filter: { outlet?: string; withHidden: boolean; limit: number }): Promise<OrderRating[]> {
    const where = and(filter.outlet ? eq(ratings.outlet, filter.outlet) : undefined, filter.withHidden ? undefined : eq(ratings.hidden, false));
    return this.db.select().from(ratings).where(where).orderBy(desc(ratings.createdAt)).limit(filter.limit);
  }

  async stars(): Promise<ItemStars[]> {
    // One row per dish on each visible rating, then grouped by dish.
    const item = sql<string>`unnest(${ratings.itemIds})`.as("item_id");
    const perDish = this.db.select({ itemId: item, food: ratings.food }).from(ratings).where(eq(ratings.hidden, false)).as("per_dish");
    const rows = await this.db
      .select({ itemId: perDish.itemId, average: sql<number>`round(avg(${perDish.food}), 1)`, count: sql<number>`count(*)` })
      .from(perDish)
      .groupBy(perDish.itemId);
    return rows.map((r) => ({ itemId: r.itemId, average: Number(r.average), count: Number(r.count) }));
  }

  async setHidden(orderId: string, hidden: boolean): Promise<void> {
    await this.db.update(ratings).set({ hidden }).where(eq(ratings.orderId, orderId));
  }
}
