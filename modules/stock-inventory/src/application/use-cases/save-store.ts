/** Adding and changing stores (super admin or the stock manager). Stores are closed, never deleted. */

import { AppError, newId, recordChange } from "@igongo/core";
import type { Store } from "../../domain/store";
import type { StockDeps } from "../stock-deps";

export type StoreFields = Omit<Store, "id">;

export async function addStore(deps: StockDeps, fields: StoreFields): Promise<Store> {
  const store: Store = { ...fields, id: newId("sto") };
  await deps.stores.save(store);
  await recordChange(deps.change, { module: "stock-inventory", action: "store.created", recordType: "store", recordId: store.id, summary: `Added store ${store.name}` });
  return store;
}

export async function editStore(deps: StockDeps, id: string, fields: Partial<StoreFields>): Promise<Store> {
  const before = await deps.stores.byId(id);
  if (!before) throw new AppError("not_found", "Store not found.");
  const store = { ...before, ...fields };
  await deps.stores.save(store);
  await recordChange(deps.change, { module: "stock-inventory", action: "store.updated", recordType: "store", recordId: id, summary: `Changed store ${store.name}${fields.active === false ? " (closed)" : ""}` });
  return store;
}
