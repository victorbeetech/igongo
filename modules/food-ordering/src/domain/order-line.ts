/** One line of an order: an item, how many, the options picked and the price then. */

export interface ChosenOption {
  group: string;
  key: string;
  name: string;
  priceDelta: number;
}

export interface OrderLine {
  itemId: string;
  /** The item's name when ordered (menus change; orders don't). */
  name: string;
  quantity: number;
  /** Base price plus the options, for one, in whole shillings. */
  unitPrice: number;
  options: ChosenOption[];
  notes: string | null;
  lineTotal: number;
  /** The day the guest wants this line (the hotel's date, YYYY-MM-DD), or null when not chosen. */
  date?: string | null;
}
