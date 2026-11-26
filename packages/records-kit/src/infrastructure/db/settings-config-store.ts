/** `RecordConfigStore` on one module's settings table (key `config`), with the module's defaults until the super admin saves. */

import { ModuleSettings, type Database } from "@igongo/core";
import type { RecordConfigStore } from "../../application/ports/config-store";
import type { RecordConfig } from "../../domain/record-config";
import type { RecordTables } from "./record-tables";

export class SettingsConfigStore implements RecordConfigStore {
  private readonly store: ModuleSettings;

  constructor(
    db: Database,
    t: RecordTables,
    private readonly defaults: RecordConfig,
  ) {
    this.store = new ModuleSettings(db, t.settings);
  }

  read(): Promise<RecordConfig> {
    return this.store.read("config", this.defaults);
  }

  write(config: RecordConfig, by: string | null, now: Date): Promise<void> {
    return this.store.write("config", config, by, now);
  }
}
