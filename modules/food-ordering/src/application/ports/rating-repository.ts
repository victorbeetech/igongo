/** Where order ratings and reviews are kept. */

import type { ItemStars, OrderRating } from "../../domain/order-rating";

export interface RatingRepository {
  byOrder(orderId: string): Promise<OrderRating | null>;
  /** Which of [orderIds] are already rated. */
  ratedAmong(orderIds: string[]): Promise<Set<string>>;
  /** Saves a new rating. @throws when the order already has one (the database refuses a second). */
  add(rating: OrderRating): Promise<void>;
  /** Newest first. [withHidden] is for staff only. */
  list(filter: { outlet?: string; withHidden: boolean; limit: number }): Promise<OrderRating[]>;
  /** Average food stars per dish, from visible ratings. */
  stars(): Promise<ItemStars[]>;
  setHidden(orderId: string, hidden: boolean): Promise<void>;
}
