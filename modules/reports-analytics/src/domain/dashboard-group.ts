/** One module's tiles on the dashboard. A module that failed shows a note, never breaks the page. */

import type { Kpi } from "@igongo/contracts/reports-analytics";

export interface DashboardGroup {
  module: string;
  title: string;
  kpis: Kpi[];
  /** True when the module could not answer; the rest of the dashboard still shows. */
  failed: boolean;
}
