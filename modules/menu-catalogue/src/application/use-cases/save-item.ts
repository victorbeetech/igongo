/**
 * Use cases that change the menu (S61-02, S61-03, S61-04):
 *   - addItem / editItem: the item editor; the outlet must be on the list;
 *   - setInStock: the kitchen's out-of-stock-today switch.
 * Each change goes to the Audit Trail.
 */

import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import type { MenuItem } from "../../domain/menu-item";
import type { MenuDeps } from "../menu-deps";

/** The fields staff fill in on the item editor. */
export type ItemFields = Omit<MenuItem, "id" | "outOfStockOn" | "updatedAt">;

/** @throws AppError when [outlet] is not one of the hotel's outlets */
async function checkOutlet(deps: MenuDeps, outlet: string) {
  const { outlets } = await deps.settings.read();
  if (!outlets.some((o) => o.key === outlet)) throw new AppError("bad_request", `Add the outlet "${outlet}" in the menu settings first.`);
}

/** The item [id]. @throws AppError not_found */
async function itemOf(deps: MenuDeps, id: string): Promise<MenuItem> {
  const item = await deps.items.byId(id);
  if (!item) throw new AppError("not_found", "Menu item not found.");
  return item;
}

export async function addItem(deps: MenuDeps, fields: ItemFields): Promise<MenuItem> {
  await checkOutlet(deps, fields.outlet);
  const item: MenuItem = { ...fields, id: newId("itm"), outOfStockOn: null, updatedAt: deps.change.now };
  await deps.items.save(item);
  await recordChange(deps.change, { module: "menu-catalogue", action: "item.created", recordType: "menu_item", recordId: item.id, summary: `Added ${item.name} at ${item.price} UGX` });
  return item;
}

export async function editItem(deps: MenuDeps, id: string, fields: Partial<ItemFields>): Promise<MenuItem> {
  const before = await itemOf(deps, id);
  if (fields.outlet) await checkOutlet(deps, fields.outlet);
  const item: MenuItem = { ...before, ...fields, updatedAt: deps.change.now };
  await deps.items.save(item);
  // Price changes are called out, because they matter in audits.
  const price = fields.price !== undefined && fields.price !== before.price ? ` (price ${before.price} to ${fields.price} UGX)` : "";
  await recordChange(deps.change, { module: "menu-catalogue", action: "item.updated", recordType: "menu_item", recordId: id, summary: `Changed ${item.name}${price}` });
  return item;
}

export async function setInStock(deps: MenuDeps, id: string, inStock: boolean): Promise<MenuItem> {
  const item: MenuItem = { ...(await itemOf(deps, id)), outOfStockOn: inStock ? null : hotelDate(deps.change.now), updatedAt: deps.change.now };
  await deps.items.save(item);
  await recordChange(deps.change, { module: "menu-catalogue", action: inStock ? "item.back_in_stock" : "item.out_of_stock", recordType: "menu_item", recordId: id, summary: `${item.name} is ${inStock ? "back in stock" : "out of stock today"}` });
  return item;
}
