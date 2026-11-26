/** `PayrollSettingsStore` on the module's settings table (key `settings`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { PayrollSettingsStore } from "../../application/ports/settings-store";
import { DEFAULT_PAYROLL_SETTINGS, type PayrollSettings } from "../../domain/payroll-settings";
import { settings } from "./schema";

export class SettingsPayrollStore implements PayrollSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<PayrollSettings> {
    return this.store.read("settings", DEFAULT_PAYROLL_SETTINGS);
  }

  write(value: PayrollSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("settings", value, by, now);
  }
}
