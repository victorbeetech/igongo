# S38. Daily Reports

[All screens](README.md) · [Module spec](../../modules/38-daily-reports.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s38-01"></a>S38-01 | My daily report | App | `/daily-reports/my-daily-report` | Today's report form for my role | Role home | S38-02 Fill daily report |
| <a id="s38-02"></a>S38-02 | Fill daily report | App | `/daily-reports/fill-daily-report` | Questions, numbers and photos, saved offline | S38-01 My daily report | D38-01 Submit report |
| <a id="s38-03"></a>S38-03 | Reports to sign | App, Web | `/daily-reports/reports-to-sign` | Reports waiting for the head of department | Role home | S38-05 Department reports, S38-06 Report detail, S38-07 Report templates, S38-08 Missing reports |
| <a id="s38-04"></a>S38-04 | Executive reports | App, Web | `/daily-reports/executive-reports` | Monthly reports from the CEO and GM to the board | Role home | S38-06 Report detail |
| <a id="s38-05"></a>S38-05 | Department reports | App, Web | `/daily-reports/department-reports` | Reports by department and day | Role home, S38-03 Reports to sign | Back only |
| <a id="s38-06"></a>S38-06 | Report detail | App, Web | `/daily-reports/report-detail/:id` | One report with comments and likes | S38-03 Reports to sign, S38-04 Executive reports | D38-02 Return report |
| <a id="s38-07"></a>S38-07 | Report templates | Web | `/daily-reports/report-templates` | Which form each role fills and when it is due | S38-03 Reports to sign | Back only |
| <a id="s38-08"></a>S38-08 | Missing reports | App, Web | `/daily-reports/missing-reports` | Who has not submitted today | S38-03 Reports to sign | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d38-01"></a>D38-01 | Submit report | Confirm, with late warning if past the deadline | S38-02 Fill daily report |
| <a id="d38-02"></a>D38-02 | Return report | Send back with a comment | S38-06 Report detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
