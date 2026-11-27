/**
 * A guest's saved cart: the dishes they picked, kept on the server so the
 * cart survives an app restart or a new phone. One cart per guest.
 *
 * The saved prices and names are only what the app last showed. Checkout
 * always prices the cart again on the server (price-cart.ts), so these
 * numbers are never charged.
 */

/** One dish in the saved cart. */
export interface SavedCartLine {
  /** The menu item's ID. */
  itemId: string;
  /** Its name, as last shown. */
  name: string;
  /** How many (1 to 100). */
  quantity: number;
  /** The unit price with options, as last shown (display only). */
  unitPrice: number;
  /** Picks, as `group:choice` keys. */
  options: string[];
  /** The day the guest wants it (YYYY-MM-DD), or null. */
  date: string | null;
  /** The guest's note for the kitchen, or null. */
  notes: string | null;
}

/** A guest's whole saved cart. */
export interface SavedCart {
  /** The outlet the cart is for, or null when empty. */
  outlet: string | null;
  /** The dishes in the cart, in the order the guest added them. */
  lines: SavedCartLine[];
  /** When the cart was last saved. */
  updatedAt: Date;
}

/** An empty cart with no outlet, used when a guest has nothing saved. */
export function emptySavedCart(now: Date): SavedCart {
  return { outlet: null, lines: [], updatedAt: now };
}
