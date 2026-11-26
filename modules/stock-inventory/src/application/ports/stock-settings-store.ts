/** Where the super admin's stock rules are saved. */

import type { StockSettings } from "../../domain/stock-settings";

export interface StockSettingsStore {
  read(): Promise<StockSettings>;
  write(settings: StockSettings, by: string | null, now: Date): Promise<void>;
}
