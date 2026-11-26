/** Where stock items are kept (stock's own schema). */

import type { StockItem } from "../../domain/stock-item";

export interface ItemRepository {
  /** Items, optionally only those whose name or code has [words], or in [category]. */
  list(filter: { words?: string; category?: string; activeOnly?: boolean }): Promise<StockItem[]>;
  byId(id: string): Promise<StockItem | null>;
  byCode(code: string): Promise<StockItem | null>;
  save(item: StockItem): Promise<void>;
}
