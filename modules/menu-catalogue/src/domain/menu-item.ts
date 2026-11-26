/**
 * One thing an outlet sells (S61-03): a dish, a drink or a set package,
 * with its price, portions and options, allergens and prep time.
 */

import type { OptionGroup } from "@igongo/contracts/menu-catalogue";
import { hotelDate } from "@igongo/core";

export interface MenuItem {
  id: string;
  /** The outlet key, from the outlets list in the menu settings. */
  outlet: string;
  /** The menu section, such as "Grill" or "Drinks". */
  section: string;
  name: string;
  description: string | null;
  /** Base price in whole shillings, set by staff (never in code). */
  price: number;
  prepMinutes: number;
  options: OptionGroup[];
  /** Dietary tags, such as `vegetarian`, `halal`, `spicy`. */
  tags: string[];
  allergens: string[];
  photoUrl: string | null;
  /** Switched on for sale at all. */
  active: boolean;
  /** Shown in the client view (some items are for waiters only). */
  visibleToClients: boolean;
  /** The hotel date it was marked out of stock, or null. Clears itself the next day. */
  outOfStockOn: string | null;
  sortOrder: number;
  updatedAt: Date;
}

/** True when [item] can be ordered at [now]: on sale and not out of stock today. */
export function isAvailable(item: MenuItem, now: Date): boolean {
  return item.active && item.outOfStockOn !== hotelDate(now);
}
