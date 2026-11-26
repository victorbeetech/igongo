/** `InspectionSettingsStore` on the module's settings table (key `settings`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { InspectionSettingsStore } from "../../application/ports/settings-store";
import { DEFAULT_INSPECTION_SETTINGS, type InspectionSettings } from "../../domain/inspection-settings";
import { settings } from "./schema";

export class SettingsInspectionStore implements InspectionSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<InspectionSettings> {
    return this.store.read("settings", DEFAULT_INSPECTION_SETTINGS);
  }

  write(value: InspectionSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("settings", value, by, now);
  }
}
