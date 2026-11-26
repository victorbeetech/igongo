// A stock item with its quantity on hand, as the stock API returns it.

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  /** The base unit, such as kg. */
  unit: string;
  /** Other units and how many base units each holds (a 50 kg sack). */
  conversions: { unit: string; per: number }[];
  reorderLevel: number;
  /** UGX per base unit, or null when the caller may not see values. */
  avgCost: number | null;
  tracksExpiry: boolean;
  active: boolean;
  /** All stores together, in base units. */
  onHand?: number;
  low?: boolean;
}
