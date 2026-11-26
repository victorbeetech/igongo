/**
 * Stock & Inventory's routes, mounted at `/api/stock` (the desk of
 * requisitions, orders, suppliers, counts and recipes is the records kit's
 * router at `/api/stock/desk`).
 *
 *   GET|PUT /settings            categories, units, rules, extra item fields
 *   GET     /stores              stores (the ones the caller works in are marked)
 *   POST    /stores, PATCH /stores/:id
 *   GET     /items?q&category    items with quantity on hand (and value for holders of values.view)
 *   GET     /items/:id           one item with its balance per store and last movements
 *   GET     /items/code/:code    find by code, barcode or QR
 *   POST    /items, PATCH /items/:id
 *   POST    /movements           receive, issue, transfer, adjust, waste
 *   POST    /counts              one item counted in one store; posts the variance
 *   GET     /movements?itemId&storeId&kind&from&to
 *   GET     /balances?storeId    stock on hand per item and store
 *   GET     /low                 items at or below their reorder level
 *   GET     /export/balances     the stock sheet as a spreadsheet
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, can, recordChange, requirePermission, requireSignIn, requireStaffPermission, scopeOf, toCsv, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { Balance } from "../application/ports/movement-repository";
import type { StockDeps } from "../application/stock-deps";
import { reachesStore, type StoreCaller } from "../application/store-reach";
import { countStock, postMovement, type Poster } from "../application/use-cases/post-movement";
import { addItem, editItem } from "../application/use-cases/save-item";
import { addStore, editStore } from "../application/use-cases/save-store";
import type { Movement } from "../domain/movement";
import type { StockItem } from "../domain/stock-item";
import { roundQty } from "../domain/stock-math";
import { STOCK_PERMISSIONS as P } from "./permissions";
import { countBody, itemBody, itemPatch, itemQuery, movementBody, movementQuery, settingsBody, storeBody, storePatch } from "./request-schemas";

/** The day after [day], for "to" filters. */
const dayAfter = (day: string) => new Date(new Date(`${day}T00:00:00+03:00`).getTime() + 86_400_000);

export function stockRouter(deps: (c: Context<ActorEnv>) => StockDeps) {
  /** The caller with the scope of [key], for store reach. */
  async function caller(c: Context<ActorEnv>, key: string): Promise<Poster> {
    const actor = actorOf(c);
    const self = deps(c).staff ? await deps(c).staff?.byUserId(actor.userId) : null;
    return { userId: actor.userId, name: actor.name, scope: scopeOf(actor, key), staffId: self?.staffId ?? null, department: self?.department ?? null };
  }

  /** The IDs of the stores [who] reaches. */
  async function reachable(c: Context<ActorEnv>, who: StoreCaller): Promise<Set<string>> {
    return new Set((await deps(c).stores.list()).filter((s) => reachesStore(who, s)).map((s) => s.id));
  }

  /** [item] without its cost when the caller may not see values. */
  const priced = (c: Context<ActorEnv>, item: StockItem) => (can(actorOf(c), P.values) ? item : { ...item, avgCost: null });
  const pricedMove = (c: Context<ActorEnv>, m: Movement) => (can(actorOf(c), P.values) ? m : { ...m, unitCost: null });

  /** Quantity on hand per item, over [balances]. */
  const totals = (balances: Balance[]) => balances.reduce((map, b) => map.set(b.itemId, roundQty((map.get(b.itemId) ?? 0) + b.qty)), new Map<string, number>());

  return new Hono<ActorEnv>()
    .get("/settings", requireSignIn, async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const s = c.req.valid("json");
      await d.settings.write(s, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "stock-inventory", action: "stock.settings_changed", recordType: "settings", recordId: "stock", summary: `${s.categories.length} categories, ${s.units.length} units, below zero ${s.allowNegative ? "allowed" : "refused"}, ${s.itemFields.length} extra item fields` });
      return c.json(s);
    })
    .get("/stores", requirePermission(P.view), async (c) => {
      const mine = await reachable(c, await caller(c, P.move));
      return c.json({ items: (await deps(c).stores.list()).map((s) => ({ ...s, mine: mine.has(s.id) })) });
    })
    .post("/stores", requireStaffPermission(P.items), zValidator("json", storeBody), async (c) => c.json(await addStore(deps(c), c.req.valid("json")), 201))
    .patch("/stores/:id", requireStaffPermission(P.items), zValidator("json", storePatch), async (c) => c.json(await editStore(deps(c), c.req.param("id"), c.req.valid("json"))))
    .get("/items", requirePermission(P.view), zValidator("query", itemQuery), async (c) => {
      const d = deps(c);
      const q = c.req.valid("query");
      const [items, balances] = await Promise.all([d.items.list({ ...(q.q ? { words: q.q } : {}), ...(q.category ? { category: q.category } : {}), activeOnly: !q.all }), d.movements.balances({})]);
      const onHand = totals(balances);
      return c.json({ items: items.map((i) => ({ ...priced(c, i), onHand: onHand.get(i.id) ?? 0, low: i.reorderLevel > 0 && (onHand.get(i.id) ?? 0) <= i.reorderLevel })) });
    })
    .get("/items/code/:code", requirePermission(P.view), async (c) => {
      const item = await deps(c).items.byCode(c.req.param("code").replace(/^IGG-ITEM:/, ""));
      if (!item) throw new AppError("not_found", "No item has that code.");
      return c.json(priced(c, item));
    })
    .get("/items/:id", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const item = await d.items.byId(c.req.param("id"));
      if (!item) throw new AppError("not_found", "Item not found.");
      const [balances, moves] = await Promise.all([d.movements.balances({ itemId: item.id }), d.movements.list({ itemId: item.id, limit: 100 })]);
      return c.json({ item: { ...priced(c, item), qr: `IGG-ITEM:${item.code}` }, balances, movements: moves.map((m) => pricedMove(c, m)) });
    })
    .post("/items", requireStaffPermission(P.items), zValidator("json", itemBody), async (c) => c.json(await addItem(deps(c), c.req.valid("json")), 201))
    .patch("/items/:id", requireStaffPermission(P.items), zValidator("json", itemPatch), async (c) => c.json(await editItem(deps(c), c.req.param("id"), c.req.valid("json"))))
    .post("/movements", requireSignIn, zValidator("json", movementBody), async (c) => {
      const body = c.req.valid("json");
      const actor = actorOf(c);
      // Adjustments and waste need the adjust (or approve) permission; the rest need move.
      const key = body.kind === "adjust" || body.kind === "waste" ? (can(actor, P.adjust) ? P.adjust : P.approve) : P.move;
      if (!can(actor, key)) throw new AppError("permission_denied", `You need the permission ${key}.`);
      return c.json(await postMovement(deps(c), await caller(c, key), body), 201);
    })
    .post("/counts", requireSignIn, zValidator("json", countBody), async (c) => {
      const actor = actorOf(c);
      const key = can(actor, P.adjust) ? P.adjust : P.approve;
      if (!can(actor, key)) throw new AppError("permission_denied", `You need the permission ${P.adjust}.`);
      return c.json(await countStock(deps(c), await caller(c, key), c.req.valid("json")));
    })
    .get("/movements", requirePermission(P.view), zValidator("query", movementQuery), async (c) => {
      const q = c.req.valid("query");
      const list = await deps(c).movements.list({ ...(q.itemId ? { itemId: q.itemId } : {}), ...(q.storeId ? { storeId: q.storeId } : {}), ...(q.kind ? { kind: q.kind } : {}), ...(q.from ? { from: new Date(`${q.from}T00:00:00+03:00`) } : {}), ...(q.to ? { to: dayAfter(q.to) } : {}), limit: 1000 });
      return c.json({ items: list.map((m) => pricedMove(c, m)) });
    })
    .get("/balances", requirePermission(P.view), async (c) => {
      const storeId = c.req.query("storeId");
      return c.json({ items: await deps(c).movements.balances(storeId ? { storeId } : {}) });
    })
    .get("/low", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const [items, balances] = await Promise.all([d.items.list({ activeOnly: true }), d.movements.balances({})]);
      const onHand = totals(balances);
      return c.json({ items: items.filter((i) => i.reorderLevel > 0 && (onHand.get(i.id) ?? 0) <= i.reorderLevel).map((i) => ({ ...priced(c, i), onHand: onHand.get(i.id) ?? 0 })) });
    })
    .get("/export/balances", requireStaffPermission(P.export), async (c) => {
      const d = deps(c);
      const [items, stores, balances] = await Promise.all([d.items.list({}), d.stores.list(), d.movements.balances({})]);
      const values = can(actorOf(c), P.values);
      const byId = new Map(items.map((i) => [i.id, i]));
      const storeName = new Map(stores.map((s) => [s.id, s.name]));
      const rows = [
        ["Code", "Item", "Category", "Store", "Quantity", "Unit", ...(values ? ["Average cost (UGX)", "Value (UGX)"] : [])],
        ...balances.map((b) => {
          const i = byId.get(b.itemId);
          return [i?.code, i?.name, i?.category, storeName.get(b.storeId), b.qty, i?.unit, ...(values ? [i?.avgCost, Math.round(b.qty * (i?.avgCost ?? 0))] : [])];
        }),
      ];
      return c.body(toCsv(rows), 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="stock.csv"' });
    });
}
