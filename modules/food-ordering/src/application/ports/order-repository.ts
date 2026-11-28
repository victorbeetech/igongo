/** Where orders are kept. */

import type { OrderStatus } from "@igongo/contracts/food-ordering";
import type { Order } from "../../domain/order";

export interface OrderRepository {
  byId(id: string): Promise<Order | null>;
  /** The order [userId] already placed with checkout key [requestKey], if any (double-tap guard). */
  byRequestKey(userId: string, requestKey: string): Promise<Order | null>;
  /** The next running number (the database refuses a repeat). */
  nextSeq(): Promise<number>;
  /** Orders in the kitchen now at [outlet] (received or preparing), for ready times. */
  queued(outlet: string): Promise<number>;
  /** Newest first. `before` keeps only orders placed earlier than that time (the next page of history). */
  list(filter: { userId?: string; outlet?: string; statuses?: OrderStatus[]; since?: Date; before?: Date; limit: number }): Promise<Order[]>;
  add(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
}
