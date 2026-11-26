/** `StockSettingsStore` on stock's settings table (key `stock`, beside the desk's `config`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { StockSettingsStore } from "../../application/ports/stock-settings-store";
import { DEFAULT_STOCK_SETTINGS, type StockSettings } from "../../domain/stock-settings";
import { settings } from "./schema";

export class SettingsStockStore implements StockSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<StockSettings> {
    return this.store.read("stock", DEFAULT_STOCK_SETTINGS);
  }

  write(value: StockSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("stock", value, by, now);
  }
}
