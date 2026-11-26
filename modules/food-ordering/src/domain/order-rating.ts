/**
 * A guest's rating of a finished order (S62-11): stars for the food, stars
 * for the delivery when a rider brought it, and a short review. One per
 * order, only by the person who ordered, only once it was delivered. Staff
 * can hide a review that breaks the rules; hidden reviews still count in
 * nothing and show nowhere.
 */

export interface OrderRating {
  orderId: string;
  userId: string;
  /** The first name shown with the review, such as "Grace". */
  name: string;
  outlet: string;
  /** The menu items on the order, so each dish gets the stars. */
  itemIds: string[];
  /** 1 to 5. */
  food: number;
  /** 1 to 5, or null when it was not a delivery. */
  delivery: number | null;
  comment: string | null;
  hidden: boolean;
  createdAt: Date;
}

/** One dish's average stars and how many ratings it has. */
export interface ItemStars {
  itemId: string;
  average: number;
  count: number;
}

/** The first word of [name], so reviews never show a full name. */
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "Guest";
