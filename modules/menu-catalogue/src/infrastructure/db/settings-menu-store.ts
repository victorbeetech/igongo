/** `MenuSettingsStore` on the module's settings table (key `menu`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { MenuSettingsStore } from "../../application/ports/menu-settings-store";
import { DEFAULT_MENU_SETTINGS, type MenuSettings } from "../../domain/menu-settings";
import { settings } from "./schema";

export class SettingsMenuStore implements MenuSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<MenuSettings> {
    return this.store.read("menu", DEFAULT_MENU_SETTINGS);
  }

  write(value: MenuSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("menu", value, by, now);
  }
}
