/**
 * Daily Reports (module 38) of the Igongo API. The gateway imports only this
 * file. See modules/daily-reports/README.md.
 */

export type { ReportsDeps } from "./application/reports-deps";
export type { DailyReport } from "./domain/daily-report";
export { DEFAULT_TEMPLATE, type ReportTemplate } from "./domain/report-template";
export { DrizzleReportRepository } from "./infrastructure/db/drizzle-report-repository";
export { SettingsTemplateStore } from "./infrastructure/db/settings-template-store";
export { REPORT_PERMISSIONS } from "./presentation/permissions";
export { reportsRouter } from "./presentation/reports-router";
