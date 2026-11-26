// One line in the guest's cart, before ordering.

export interface CartLine {
  itemId: string;
  name: string;
  quantity: number;
  /** Picks as `group:choice` keys. */
  options: string[];
  /** The price the page shows (the API prices it again). */
  unitPrice: number;
}
