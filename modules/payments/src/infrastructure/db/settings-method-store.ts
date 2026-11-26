/** `MethodSettingsStore` on the module's settings table (key `methods`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { MethodSettingsStore } from "../../application/ports/method-settings-store";
import { DEFAULT_METHOD_SETTINGS, type MethodSettings } from "../../domain/method-settings";
import { settings } from "./schema";

export class SettingsMethodStore implements MethodSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  async read(): Promise<MethodSettings> {
    const saved = await this.store.read("methods", DEFAULT_METHOD_SETTINGS);
    // A method added in a later version gets its default switch.
    return { ...saved, methods: { ...DEFAULT_METHOD_SETTINGS.methods, ...saved.methods } };
  }

  write(value: MethodSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("methods", value, by, now);
  }
}
