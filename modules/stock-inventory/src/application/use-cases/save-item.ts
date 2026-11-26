/**
 * Adding and changing stock items. The unit and category must be on the
 * super admin's lists, extra fields are cleaned against the super admin's
 * item fields, and codes are unique. The average cost changes only through
 * receipts, never by hand.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import { cleanFields } from "@igongo/records-kit";
import type { StockItem } from "../../domain/stock-item";
import type { StockDeps } from "../stock-deps";

export type ItemFields = Omit<StockItem, "id" | "avgCost" | "updatedAt">;

/** Checks [fields] against the settings and returns them cleaned. */
async function checked(deps: StockDeps, fields: ItemFields, id: string | null): Promise<ItemFields> {
  const s = await deps.settings.read();
  if (!s.categories.includes(fields.category)) throw new AppError("bad_request", `"${fields.category}" is not a stock category. Add it in the stock settings.`);
  for (const u of [fields.unit, ...fields.conversions.map((c) => c.unit)]) if (!s.units.includes(u)) throw new AppError("bad_request", `"${u}" is not a stock unit. Add it in the stock settings.`);
  const same = await deps.items.byCode(fields.code);
  if (same && same.id !== id) throw new AppError("conflict", `Another item already has the code ${fields.code}.`);
  // Extra fields use the records kit's rules, as one pretend record type.
  const extra = cleanFields({ key: "item", name: "Item", active: true, fields: s.itemFields, statuses: [] }, fields.extra);
  return { ...fields, code: fields.code.toUpperCase(), extra };
}

export async function addItem(deps: StockDeps, fields: ItemFields): Promise<StockItem> {
  const item: StockItem = { ...(await checked(deps, fields, null)), id: newId("itm"), avgCost: 0, updatedAt: deps.change.now };
  await deps.items.save(item);
  await recordChange(deps.change, { module: "stock-inventory", action: "item.created", recordType: "item", recordId: item.id, summary: `Added ${item.code} ${item.name} (${item.unit})` });
  return item;
}

export async function editItem(deps: StockDeps, id: string, fields: Partial<ItemFields>): Promise<StockItem> {
  const before = await deps.items.byId(id);
  if (!before) throw new AppError("not_found", "Item not found.");
  if (fields.unit && fields.unit !== before.unit) throw new AppError("bad_request", "An item's base unit cannot change once it has stock. Add a conversion instead.");
  const merged = { ...before, ...fields };
  const item: StockItem = { ...merged, ...(await checked(deps, merged, id)), id, avgCost: before.avgCost, updatedAt: deps.change.now };
  await deps.items.save(item);
  await recordChange(deps.change, { module: "stock-inventory", action: "item.updated", recordType: "item", recordId: id, summary: `Changed ${item.code} ${item.name}${fields.reorderLevel !== undefined ? ` (reorder at ${fields.reorderLevel})` : ""}` });
  return item;
}
