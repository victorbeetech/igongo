/**
 * One item the hotel stocks, such as rice, soda or bed sheets. Quantities
 * are kept in the item's base unit (such as kg or bottle); other units the
 * item is bought or issued in convert to it (such as 1 sack = 50 kg).
 */

import type { FieldValue } from "@igongo/records-kit";

/** Another unit of an item and how many base units it holds. */
export interface UnitConversion {
  unit: string;
  /** Base units in one of this unit, such as 50 for a 50 kg sack. */
  per: number;
}

export interface StockItem {
  id: string;
  /** The item code, such as `RICE-01`; also the QR and barcode text. */
  code: string;
  name: string;
  category: string;
  /** The base unit, such as `kg`. */
  unit: string;
  conversions: UnitConversion[];
  /** Below this (in base units, all stores together) the item is low. */
  reorderLevel: number;
  /** Average cost of one base unit, in UGX, updated on every receipt. */
  avgCost: number;
  /** Batch and expiry are asked for when receiving. */
  tracksExpiry: boolean;
  photoId: string | null;
  /** The super admin's extra item fields (Custom Fields), by key. */
  extra: Record<string, FieldValue>;
  active: boolean;
  updatedAt: Date;
}
