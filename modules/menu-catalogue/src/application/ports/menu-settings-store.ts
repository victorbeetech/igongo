/** Where the menu options are kept. */

import type { MenuSettings } from "../../domain/menu-settings";

export interface MenuSettingsStore {
  read(): Promise<MenuSettings>;
  write(settings: MenuSettings, by: string | null, now: Date): Promise<void>;
}
