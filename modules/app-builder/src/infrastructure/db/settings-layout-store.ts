/** `LayoutStore` on the module's settings table. */

import { ModuleSettings, type Database } from "@igongo/core";
import type { LayoutStore } from "../../application/ports/layout-store";
import { DEFAULT_LAYOUT_SETTINGS, type LayoutSettings } from "../../domain/layout-settings";
import type { LayoutVersion } from "../../domain/layout-version";
import { emptyLayout, type RoleLayout } from "../../domain/role-layout";
import { settings } from "./schema";

export class SettingsLayoutStore implements LayoutStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  layout(roleId: string): Promise<RoleLayout> {
    return this.store.read(`role:${roleId}`, emptyLayout(roleId));
  }

  layouts(roleIds: string[]): Promise<RoleLayout[]> {
    return Promise.all(roleIds.map((id) => this.layout(id)));
  }

  saveLayout(layout: RoleLayout, by: string | null, now: Date): Promise<void> {
    return this.store.write(`role:${layout.roleId}`, layout, by, now);
  }

  async history(roleId: string): Promise<LayoutVersion[]> {
    return (await this.store.read<{ versions: LayoutVersion[] }>(`history:${roleId}`, { versions: [] })).versions;
  }

  saveHistory(roleId: string, versions: LayoutVersion[], by: string | null, now: Date): Promise<void> {
    return this.store.write(`history:${roleId}`, { versions }, by, now);
  }

  settings(): Promise<LayoutSettings> {
    return this.store.read("settings", DEFAULT_LAYOUT_SETTINGS);
  }

  saveSettings(value: LayoutSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("settings", value, by, now);
  }
}
