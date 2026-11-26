/** Where menu items are kept. */

import type { MenuItem } from "../../domain/menu-item";

export interface ItemRepository {
  byId(id: string): Promise<MenuItem | null>;
  byIds(ids: string[]): Promise<MenuItem[]>;
  /** Items of [outlet] (or every outlet), by section and sort order. */
  list(filter: { outlet?: string }): Promise<MenuItem[]>;
  save(item: MenuItem): Promise<void>;
}
