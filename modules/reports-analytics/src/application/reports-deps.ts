/** Everything Reports & Analytics needs, given by the gateway per request. */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { ChangeContext } from "@igongo/core";
import type { DashboardSettingsStore } from "./ports/settings-store";

export interface ReportsDeps {
  /** One source per module that has numbers and is switched on. */
  sources: KpiSource[];
  settings: DashboardSettingsStore;
  change: ChangeContext;
}
