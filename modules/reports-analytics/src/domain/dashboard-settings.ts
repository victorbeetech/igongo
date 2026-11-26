/**
 * The super admin's dashboard settings (S81-06): tiles to hide, and the
 * range the dashboard opens on.
 */

export interface DashboardSettings {
  /** KPI keys not shown, such as `payroll.employer`. */
  hidden: string[];
  /** Days the dashboard opens on: 1 (today), 7 or 30. */
  defaultDays: 1 | 7 | 30;
}

export const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = { hidden: [], defaultDays: 1 };
