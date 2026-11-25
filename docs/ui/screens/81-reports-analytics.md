# S81. Reports & Analytics

[All screens](README.md) · [Module spec](../../modules/81-reports-analytics.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s81-01"></a>S81-01 | Dashboards | App, Web | `/reports-analytics/dashboards` | Dashboards for my role | Role home | S81-02 Dashboard, S81-03 Report builder, S81-05 Scheduled reports, S81-06 Targets and alerts |
| <a id="s81-02"></a>S81-02 | Dashboard | App, Web | `/reports-analytics/dashboard` | Charts and numbers with drill-down | Role home, S81-01 Dashboards | D81-01 Export report, D81-02 Share report |
| <a id="s81-03"></a>S81-03 | Report builder | Web | `/reports-analytics/report-builder` | Module, fields, filters, groups and chart | S81-01 Dashboards | S81-04 Saved reports |
| <a id="s81-04"></a>S81-04 | Saved reports | App, Web | `/reports-analytics/saved-reports` | My and shared reports | S81-03 Report builder | Back only |
| <a id="s81-05"></a>S81-05 | Scheduled reports | Web | `/reports-analytics/scheduled-reports` | Reports sent by email or WhatsApp on a schedule | S81-01 Dashboards | Back only |
| <a id="s81-06"></a>S81-06 | Targets and alerts | Web | `/reports-analytics/targets-and-alerts` | Targets with alerts | S81-01 Dashboards | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d81-01"></a>D81-01 | Export report | PDF or Excel | S81-02 Dashboard |
| <a id="d81-02"></a>D81-02 | Share report | Pick people or roles | S81-02 Dashboard |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
