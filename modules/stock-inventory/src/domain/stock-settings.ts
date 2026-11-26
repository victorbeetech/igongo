/**
 * Stock's rules, set by the super admin (no code): item categories, the
 * units items can use, whether a store may go below zero, and the extra
 * fields every item has.
 */

import type { FieldDef } from "@igongo/records-kit";

export interface StockSettings {
  categories: string[];
  units: string[];
  /** Allow issues that would leave a store below zero (normally off). */
  allowNegative: boolean;
  /** A reason is needed on adjustments and waste. */
  reasonRequired: boolean;
  /** Extra item fields, such as "Shelf" or "Brand". */
  itemFields: FieldDef[];
}

export const DEFAULT_STOCK_SETTINGS: StockSettings = {
  categories: ["Food", "Drinks", "Cleaning", "Linen", "Amenities", "Stationery", "Crafts and books", "Fuel", "Spare parts"],
  units: ["piece", "kg", "g", "litre", "ml", "bottle", "crate", "sack", "box", "packet", "roll", "pair", "set"],
  allowNegative: false,
  reasonRequired: true,
  itemFields: [],
};
