/**
 * One line of the stock ledger. Every change to stock is a movement, kept
 * for ever, so the balance of any item in any store is the sum of its
 * movements, and every change shows who made it and why.
 *
 *   receive   into a store (from a supplier, with a unit cost)
 *   issue     out of a store (to a department or a person)
 *   transfer  out of one store and into another
 *   adjust    a correction in or out, with a reason
 *   waste     out of a store as spoiled, broken or expired
 *   count     a stock count's correction (the difference found)
 */

export const MOVEMENT_KINDS = ["receive", "issue", "transfer", "adjust", "waste", "count"] as const;
export type MovementKind = (typeof MOVEMENT_KINDS)[number];

export interface Movement {
  id: string;
  /** Running number, such as `STK-0042`. */
  number: string;
  kind: MovementKind;
  itemId: string;
  itemName: string;
  /** Where it left, or null. */
  fromStoreId: string | null;
  /** Where it arrived, or null. */
  toStoreId: string | null;
  /** In the item's base unit, always above zero. */
  qty: number;
  /** UGX per base unit (the receipt's price, or the average cost at the time). */
  unitCost: number;
  /** A supplier, order or requisition code, such as `PO-0012`. */
  reference: string | null;
  /** Who it went to, for issues. */
  issuedTo: string | null;
  batch: string | null;
  expiresOn: string | null;
  note: string | null;
  byId: string | null;
  byName: string;
  at: Date;
}
