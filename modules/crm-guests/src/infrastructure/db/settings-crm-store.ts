/** `CrmSettingsStore` on the module's settings table (key `crm`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { CrmSettingsStore } from "../../application/ports/crm-settings-store";
import { DEFAULT_CRM_SETTINGS, type CrmSettings } from "../../domain/crm-settings";
import { settings } from "./schema";

export class SettingsCrmStore implements CrmSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<CrmSettings> {
    return this.store.read("crm", DEFAULT_CRM_SETTINGS);
  }

  write(value: CrmSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("crm", value, by, now);
  }
}
