/**
 * Permission keys Reports & Analytics checks. With scope `all` the viewer
 * sees every module's tiles; with a narrower scope only the modules whose
 * own `<module>.reports.view` they hold wider than `own`.
 */

export const REPORT_PERMISSIONS = {
  view: "reports-analytics.dashboard.view",
  export: "reports-analytics.dashboard.export",
  settings: "reports-analytics.settings.edit",
} as const;
