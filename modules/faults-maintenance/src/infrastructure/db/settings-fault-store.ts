/** `FaultSettingsStore` on the module's settings table (key `settings`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { FaultSettingsStore } from "../../application/ports/settings-store";
import { DEFAULT_FAULT_SETTINGS, type FaultSettings } from "../../domain/fault-settings";
import { settings } from "./schema";

export class SettingsFaultStore implements FaultSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<FaultSettings> {
    return this.store.read("settings", DEFAULT_FAULT_SETTINGS);
  }

  write(value: FaultSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("settings", value, by, now);
  }
}
