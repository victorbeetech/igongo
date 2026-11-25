# S40. Faults & Maintenance

[All screens](README.md) · [Module spec](../../modules/40-faults-maintenance.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s40-01"></a>S40-01 | Report fault | App | `/faults-maintenance/report-fault` | Photo, place or asset, description and urgency | Role home, [D39-01 Failed item](39-inspections.md#d39-01), [S41-02 Asset detail](41-asset-register.md#s41-02) | S40-02 My faults, S40-07 Maintenance settings |
| <a id="s40-02"></a>S40-02 | My faults | App | `/faults-maintenance/my-faults` | Faults I reported and their progress | S40-01 Report fault | S40-04 Fault detail |
| <a id="s40-03"></a>S40-03 | Fault board | App, Web | `/faults-maintenance/fault-board` | All faults by status, area and priority | Role home | S40-04 Fault detail, S40-05 Work orders, S40-06 Planned maintenance |
| <a id="s40-04"></a>S40-04 | Fault detail | App, Web | `/faults-maintenance/fault-detail/:id` | Photos, comments, likes, work done and cost | S40-02 My faults, S40-03 Fault board, S40-05 Work orders | D40-01 Assign fault, D40-02 Close fault, D40-03 Reopen fault |
| <a id="s40-05"></a>S40-05 | Work orders | App, Web | `/faults-maintenance/work-orders` | Jobs assigned to maintenance staff | Role home, S40-03 Fault board | S40-04 Fault detail |
| <a id="s40-06"></a>S40-06 | Planned maintenance | Web | `/faults-maintenance/planned-maintenance` | Scheduled servicing by asset | Role home, S40-03 Fault board | Back only |
| <a id="s40-07"></a>S40-07 | Maintenance settings | Web | `/faults-maintenance/maintenance-settings` | Fault categories, urgency levels and target fix times; Who sees each category's feed, and who can comment or like; Who assigns and who closes; Whether the... | S40-01 Report fault | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d40-01"></a>D40-01 | Assign fault | Pick technician and due date | S40-04 Fault detail |
| <a id="d40-02"></a>D40-02 | Close fault | Work done, parts used and photo after | S40-04 Fault detail |
| <a id="d40-03"></a>D40-03 | Reopen fault | Reason the fix did not hold | S40-04 Fault detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
