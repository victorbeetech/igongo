/** Where the dashboard settings are kept. */

import type { DashboardSettings } from "../../domain/dashboard-settings";

export interface DashboardSettingsStore {
  read(): Promise<DashboardSettings>;
  write(settings: DashboardSettings, by: string | null, now: Date): Promise<void>;
}
