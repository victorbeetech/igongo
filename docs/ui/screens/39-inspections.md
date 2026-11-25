# S39. Inspections & Checklists

[All screens](README.md) · [Module spec](../../modules/39-inspections.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s39-01"></a>S39-01 | Inspections due | App | `/inspections/inspections-due` | Checklists due today for me | Role home | S39-02 Run inspection |
| <a id="s39-02"></a>S39-02 | Run inspection | App, Kiosk | `/inspections/run-inspection` | Fill the checklist with photos, scores and signature | Role home, S39-01 Inspections due, [S43-06 Rooms to inspect](43-housekeeping.md#s43-06) | S39-03 Inspection result |
| <a id="s39-03"></a>S39-03 | Inspection result | App, Web | `/inspections/inspection-result/:id` | Score, failed items and actions raised | S39-02 Run inspection, S39-04 Inspections list | D39-01 Failed item |
| <a id="s39-04"></a>S39-04 | Inspections list | App, Web | `/inspections/inspections-list` | Inspections by area, person and score | Role home | S39-03 Inspection result, S39-05 Inspection schedule |
| <a id="s39-05"></a>S39-05 | Inspection schedule | Web | `/inspections/inspection-schedule` | Which checklist, where, how often and by whom | S39-04 Inspections list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d39-01"></a>D39-01 | Failed item | Raise a fault or task from a failed item | S39-03 Inspection result |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
