/** `StoreRepository` on stock's `stores` table. */

import { omitKey, type Database } from "@igongo/core";
import { asc, eq } from "drizzle-orm";
import type { StoreRepository } from "../../application/ports/store-repository";
import type { Store } from "../../domain/store";
import { stores } from "./schema";

export class DrizzleStoreRepository implements StoreRepository {
  constructor(private readonly db: Database) {}

  list(): Promise<Store[]> {
    return this.db.select().from(stores).orderBy(asc(stores.name));
  }

  async byId(id: string): Promise<Store | null> {
    const [row] = await this.db.select().from(stores).where(eq(stores.id, id));
    return row ?? null;
  }

  async save(store: Store): Promise<void> {
    await this.db.insert(stores).values(store).onConflictDoUpdate({ target: stores.id, set: omitKey(store, "id") });
  }
}
