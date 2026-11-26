/**
 * Stock & Inventory (module 84) of the Igongo API. The gateway imports only
 * this file. See modules/stock-inventory/README.md.
 */

import { recordKpis, recordsRouter } from "@igongo/records-kit";
import type { Database } from "@igongo/core";
import { stockDeskModule } from "./domain/stock-desk-module";
import { deskTables } from "./infrastructure/db/schema";

export type { StockDeps } from "./application/stock-deps";
export { DEFAULT_STOCK_SETTINGS, type StockSettings } from "./domain/stock-settings";
export { stockDeskModule };
export { stockDeps, stockDeskDeps } from "./infrastructure/stock-deps-factory";
export { stockKpis } from "./infrastructure/stock-kpis";
export { STOCK_PERMISSIONS } from "./presentation/permissions";
export { stockRouter } from "./presentation/stock-router";

/** The desk's routes (requisitions, purchasing, suppliers, counts, recipes), mounted at `/api/stock/desk`. */
export const stockDeskRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(stockDeskModule.key, deps);

/** The desk's dashboard numbers. */
export const stockDeskKpis = (db: Database) => recordKpis(stockDeskModule, deskTables, db, "Stock requests and orders");
