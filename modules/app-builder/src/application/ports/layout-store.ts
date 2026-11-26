/** Where role layouts, their history and the layout rules are kept. */

import type { LayoutSettings } from "../../domain/layout-settings";
import type { LayoutVersion } from "../../domain/layout-version";
import type { RoleLayout } from "../../domain/role-layout";

export interface LayoutStore {
  layout(roleId: string): Promise<RoleLayout>;
  layouts(roleIds: string[]): Promise<RoleLayout[]>;
  saveLayout(layout: RoleLayout, by: string | null, now: Date): Promise<void>;
  history(roleId: string): Promise<LayoutVersion[]>;
  saveHistory(roleId: string, versions: LayoutVersion[], by: string | null, now: Date): Promise<void>;
  settings(): Promise<LayoutSettings>;
  saveSettings(value: LayoutSettings, by: string | null, now: Date): Promise<void>;
}
