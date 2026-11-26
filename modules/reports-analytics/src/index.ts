/**
 * Reports & Analytics (module 81) of the Igongo API: the management
 * dashboard. The gateway imports only this file.
 */

export type { ReportsDeps } from "./application/reports-deps";
export { readDashboard } from "./application/use-cases/read-dashboard";
export { DEFAULT_DASHBOARD_SETTINGS, type DashboardSettings } from "./domain/dashboard-settings";
export { SettingsDashboardStore } from "./infrastructure/db/settings-dashboard-store";
export { hotelRange } from "./presentation/hotel-range";
export { REPORT_PERMISSIONS } from "./presentation/permissions";
export { reportsRouter } from "./presentation/reports-router";
