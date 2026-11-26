/** Where stores are kept (stock's own schema). */

import type { Store } from "../../domain/store";

export interface StoreRepository {
  list(): Promise<Store[]>;
  byId(id: string): Promise<Store | null>;
  save(store: Store): Promise<void>;
}
