/** Builds stock's dependencies on its own tables, for the ledger and for the desk. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordsDeps, type RecordsDeps } from "@igongo/records-kit";
import type { StockDeps } from "../application/stock-deps";
import { stockDeskModule } from "../domain/stock-desk-module";
import { DrizzleItemRepository } from "./db/drizzle-item-repository";
import { DrizzleMovementRepository } from "./db/drizzle-movement-repository";
import { DrizzleStoreRepository } from "./db/drizzle-store-repository";
import { deskTables } from "./db/schema";
import { SettingsStockStore } from "./db/settings-stock-store";

export function stockDeps(db: Database, change: ChangeContext, staff: StaffDirectory | null): StockDeps {
  return { stores: new DrizzleStoreRepository(db), items: new DrizzleItemRepository(db), movements: new DrizzleMovementRepository(db), settings: new SettingsStockStore(db), staff, change };
}

export function stockDeskDeps(db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps {
  return recordsDeps(stockDeskModule, deskTables, db, change, staff);
}
