/** `OrderRepository` on Postgres, with Drizzle. */

import type { OrderStatus } from "@igongo/contracts/food-ordering";
import type { Database } from "@igongo/core";
import { and, asc, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { OrderRepository } from "../../application/ports/order-repository";
import type { Order } from "../../domain/order";
import { orders } from "./schema";

export class DrizzleOrderRepository implements OrderRepository {
  constructor(private readonly db: Database) {}

  async byId(id: string): Promise<Order | null> {
    const [row] = await this.db.select().from(orders).where(eq(orders.id, id));
    return row ?? null;
  }

  async byRequestKey(userId: string, requestKey: string): Promise<Order | null> {
    const [row] = await this.db.select().from(orders).where(and(eq(orders.userId, userId), eq(orders.requestKey, requestKey)));
    return row ?? null;
  }

  async nextSeq(): Promise<number> {
    const [row] = await this.db.select({ max: sql<number>`coalesce(max(${orders.seq}), 0)` }).from(orders);
    return Number(row?.max ?? 0) + 1;
  }

  async queued(outlet: string): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(orders).where(and(eq(orders.outlet, outlet), inArray(orders.status, ["received", "preparing"])));
    return Number(row?.n ?? 0);
  }

  list(filter: { userId?: string; outlet?: string; statuses?: OrderStatus[]; since?: Date; before?: Date; limit: number }): Promise<Order[]> {
    const where = and(
      filter.userId ? eq(orders.userId, filter.userId) : undefined,
      filter.outlet ? eq(orders.outlet, filter.outlet) : undefined,
      filter.statuses?.length ? inArray(orders.status, filter.statuses) : undefined,
      filter.since ? gte(orders.createdAt, filter.since) : undefined,
      // Paging: only orders placed before the cursor time (the previous page's last row).
      filter.before ? lt(orders.createdAt, filter.before) : undefined,
    );
    // The guest's list is newest first; the board is soonest ready first.
    const order = filter.userId ? desc(orders.createdAt) : asc(orders.readyAt);
    return this.db.select().from(orders).where(where).orderBy(order).limit(filter.limit);
  }

  async add(order: Order): Promise<void> {
    await this.db.insert(orders).values(order);
  }

  async update(order: Order): Promise<void> {
    const { id, ...rest } = order;
    await this.db.update(orders).set(rest).where(eq(orders.id, id));
  }
}
