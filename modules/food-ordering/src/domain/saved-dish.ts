/**
 * A dish a guest saved (the heart on a dish). One row per guest and dish:
 * the guest's own user ID and the menu item's ID are the key, so a guest
 * only ever sees and changes their own list.
 */

/** A saved dish as the guest sees it: the menu's current name and price. */
export interface SavedDish {
  /** The menu item's ID. */
  itemId: string;
  /** The outlet that sells it. */
  outlet: string;
  /** The dish's name on the menu now. */
  name: string;
  /** The base price on the menu now, whole shillings. */
  price: number;
  /** False when the dish is switched off or out of stock today. */
  available: boolean;
  /** When the guest saved it (server time). */
  savedAt: Date;
}

/** The row kept for a saved dish (names and prices come from the menu, not stored). */
export interface SavedDishRow {
  userId: string;
  itemId: string;
  outlet: string;
  savedAt: Date;
}
