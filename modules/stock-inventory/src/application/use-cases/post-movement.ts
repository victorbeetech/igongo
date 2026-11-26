/**
 * Posting one movement to the stock ledger (receive, issue, transfer,
 * adjust, waste) or a stock count's correction. Steps:
 *
 *   1. Find the item and turn the quantity into its base unit.
 *   2. Check the stores this kind needs, and that the caller may work in them.
 *   3. Refuse a store going below zero (unless the super admin allows it).
 *   4. Receipts update the item's average cost.
 *   5. Save the movement and record it in the Audit Trail.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import type { Movement, MovementKind } from "../../domain/movement";
import { newAverageCost, roundQty, sidesOf, toBaseUnits } from "../../domain/stock-math";
import type { StockDeps } from "../stock-deps";
import { reachesStore, type StoreCaller } from "../store-reach";

/** What a form sends to post a movement. */
export interface MovementInput {
  kind: MovementKind;
  itemId: string;
  qty: number;
  /** The unit typed, such as `sack` (default: the item's base unit). */
  unit?: string;
  fromStoreId?: string | null;
  toStoreId?: string | null;
  /** For receipts: UGX per unit typed. */
  unitCost?: number;
  reference?: string | null;
  issuedTo?: string | null;
  batch?: string | null;
  expiresOn?: string | null;
  note?: string | null;
}

/** The caller, with their name for the ledger. */
export interface Poster extends StoreCaller {
  userId: string;
  name: string;
}

/** The quantity of [itemId] in [storeId] now. */
async function onHand(deps: StockDeps, itemId: string, storeId?: string): Promise<number> {
  const rows = await deps.movements.balances({ itemId, ...(storeId ? { storeId } : {}) });
  return roundQty(rows.reduce((sum, b) => sum + b.qty, 0));
}

/** The store [id], if [who] may work in it (or, with [anyStore], if it is open). */
async function usableStore(deps: StockDeps, who: Poster, id: string | null | undefined, side: string, anyStore = false) {
  if (!id) throw new AppError("bad_request", `Choose the store it goes ${side}.`);
  const store = await deps.stores.byId(id);
  if (!store || !store.active) throw new AppError("bad_request", "That store is closed or does not exist.");
  if (!anyStore && !reachesStore(who, store)) throw new AppError("permission_denied", `You do not work in ${store.name}.`);
  return store;
}

export async function postMovement(deps: StockDeps, who: Poster, input: MovementInput): Promise<Movement> {
  // Step 1: the item and the quantity in base units.
  const item = await deps.items.byId(input.itemId);
  if (!item || !item.active) throw new AppError("bad_request", "That item is switched off or does not exist.");
  const qty = roundQty(toBaseUnits(item, input.qty, input.unit));
  if (qty <= 0) throw new AppError("bad_request", "The quantity must be above zero.");
  const settings = await deps.settings.read();
  if ((input.kind === "adjust" || input.kind === "waste") && settings.reasonRequired && !input.note?.trim()) throw new AppError("bad_request", "Give a reason for this change.");
  // Step 2: the stores this kind needs (an adjustment names one side).
  const sides = sidesOf(input.kind);
  const fromNeeded = sides.from || (!!sides.either && !!input.fromStoreId && !input.toStoreId);
  const toNeeded = sides.to || (!!sides.either && !fromNeeded);
  const from = fromNeeded ? await usableStore(deps, who, input.fromStoreId, "out of") : null;
  // A transfer may send stock into any open store: the sender answers for the store it leaves.
  const to = toNeeded ? await usableStore(deps, who, input.toStoreId, "into", input.kind === "transfer") : null;
  if (from && to && from.id === to.id) throw new AppError("bad_request", "A transfer needs two different stores.");
  // Step 3: no store below zero.
  if (from && !settings.allowNegative) {
    const has = await onHand(deps, item.id, from.id);
    if (has < qty) throw new AppError("conflict", `${from.name} has only ${has} ${item.unit} of ${item.name}.`);
  }
  // Step 4: receipts set the price and the new average cost.
  let unitCost = item.avgCost;
  if (input.kind === "receive") {
    const perTyped = input.unitCost ?? 0;
    unitCost = Math.round(perTyped / (qty / input.qty));
    const avgCost = newAverageCost(await onHand(deps, item.id), item.avgCost, qty, unitCost);
    await deps.items.save({ ...item, avgCost, updatedAt: deps.change.now });
  }
  // Step 5: save and audit.
  const m: Movement = {
    id: newId("mov"), number: await deps.movements.nextNumber(), kind: input.kind, itemId: item.id, itemName: item.name,
    fromStoreId: from?.id ?? null, toStoreId: to?.id ?? null, qty, unitCost,
    reference: input.reference?.trim() || null, issuedTo: input.issuedTo?.trim() || null, batch: input.batch?.trim() || null, expiresOn: input.expiresOn ?? null,
    note: input.note?.trim() || null, byId: who.userId, byName: who.name, at: deps.change.now,
  };
  await deps.movements.add(m);
  const where = [from && `from ${from.name}`, to && `to ${to.name}`].filter(Boolean).join(" ");
  await recordChange(deps.change, { module: "stock-inventory", action: `stock.${input.kind}`, recordType: "movement", recordId: m.id, summary: `${m.number} ${input.kind} ${qty} ${item.unit} ${item.name} ${where}${m.note ? `: ${m.note}` : ""}` });
  return m;
}

/**
 * A stock count of [itemId] in [storeId]: posts the difference between
 * [counted] and what the ledger says as a `count` movement (or nothing
 * when they match), and returns the variance.
 */
export async function countStock(deps: StockDeps, who: Poster, input: { itemId: string; storeId: string; counted: number; reference?: string | null; note?: string | null }) {
  const expected = await onHand(deps, input.itemId, input.storeId);
  const variance = roundQty(input.counted - expected);
  if (variance === 0) return { expected, counted: input.counted, variance, movement: null };
  const movement = await postMovement(deps, who, {
    kind: "count", itemId: input.itemId, qty: Math.abs(variance),
    ...(variance > 0 ? { toStoreId: input.storeId } : { fromStoreId: input.storeId }),
    reference: input.reference ?? null, note: input.note?.trim() || `Count found ${input.counted}, expected ${expected}`,
  });
  return { expected, counted: input.counted, variance, movement };
}
