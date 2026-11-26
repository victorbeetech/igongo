/**
 * Public contract of Menus & Catalogue (module 61): what the kitchens sell,
 * read by Food Ordering to price and time an order. Food Ordering never
 * reads the menu tables.
 */

/** One choice in an option group, such as "1 kg" (+ price). */
export interface OptionChoice {
  key: string;
  name: string;
  /** Added to the item's price, whole shillings (can be 0). */
  priceDelta: number;
}

/** A group of options on an item, such as "Portion" or "Extras". */
export interface OptionGroup {
  key: string;
  name: string;
  /** The guest must pick one. */
  required: boolean;
  /** The guest may pick more than one. */
  multiple: boolean;
  choices: OptionChoice[];
}

/** An outlet that sells food, such as the main restaurant or the pool bar. */
export interface OutletRef {
  key: string;
  name: string;
}

/** A menu item as other modules see it. */
export interface MenuItemRef {
  itemId: string;
  outlet: string;
  name: string;
  /** Base price, whole shillings. */
  price: number;
  /** Minutes the kitchen needs, for ready times and pre-orders. */
  prepMinutes: number;
  /** False when switched off or out of stock today. */
  available: boolean;
  options: OptionGroup[];
}

/** Reads menu items. The gateway builds it from Menus & Catalogue. */
export interface MenuReader {
  /** Several items at once; unknown IDs are left out. */
  items(itemIds: string[]): Promise<MenuItemRef[]>;
  outlet(key: string): Promise<OutletRef | null>;
}

/** Events this module emits. */
export const MENU_EVENTS = {
  itemUpdated: "item.updated",
  outOfStock: "item.out_of_stock",
  backInStock: "item.back_in_stock",
} as const;
