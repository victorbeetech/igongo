/**
 * Reports & Analytics (module 81) of the Igongo API: the management
 * dashboard. The gateway imports only this file.
 */

export type { ReportsDeps } from "./application/reports-deps";
export { readDashboard } from "./application/use-cases/read-dashboard";
export { DEFAULT_DASHBOARD_SETTINGS, type DashboardSettings } from "./domain/dashboard-settings";
export { SettingsDashboardStore } from "./infrastructure/db/settings-dashboard-store";
export { hotelRange } from "./domain/hotel-range";
export { REPORT_PERMISSIONS } from "./presentation/permissions";
export { reportsRouter } from "./presentation/reports-router";
export { runDueReports, type DueRunReport } from "./application/use-cases/run-due-reports";
export { isDue } from "./domain/report-due";
export type { ReportRun } from "./domain/report-run";
export type { SavedReport } from "./domain/saved-report";
export { DrizzleSavedReportStore } from "./infrastructure/db/drizzle-saved-report-store";
