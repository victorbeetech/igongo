/** `DashboardSettingsStore` on the module's settings table (key `dashboard`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { DashboardSettingsStore } from "../../application/ports/settings-store";
import { DEFAULT_DASHBOARD_SETTINGS, type DashboardSettings } from "../../domain/dashboard-settings";
import { settings } from "./schema";

export class SettingsDashboardStore implements DashboardSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<DashboardSettings> {
    return this.store.read("dashboard", DEFAULT_DASHBOARD_SETTINGS);
  }

  write(value: DashboardSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("dashboard", value, by, now);
  }
}
