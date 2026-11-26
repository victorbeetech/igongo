// One line of the stock ledger: stock received, issued, moved, adjusted,
// wasted or corrected by a count.

export type MovementKind = "receive" | "issue" | "transfer" | "adjust" | "waste" | "count";

export interface Movement {
  id: string;
  /** Running number, such as STK-0042. */
  number: string;
  kind: MovementKind;
  itemId: string;
  itemName: string;
  fromStoreId: string | null;
  toStoreId: string | null;
  qty: number;
  unitCost: number | null;
  reference: string | null;
  issuedTo: string | null;
  note: string | null;
  byName: string;
  at: string;
}

/** Each kind in words. */
export const KIND_WORDS: Record<MovementKind, string> = {
  receive: "Received",
  issue: "Issued",
  transfer: "Transferred",
  adjust: "Adjusted",
  waste: "Wasted",
  count: "Count correction",
};
