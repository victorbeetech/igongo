# S24. Onboarding & Exit

[All screens](README.md) · [Module spec](../../modules/24-onboarding-exit.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s24-01"></a>S24-01 | Onboarding list | Web | `/onboarding-exit/onboarding-list` | New starters and their onboarding progress | Role home | S24-02 Onboarding checklist, S24-07 Onboarding and exit settings |
| <a id="s24-02"></a>S24-02 | Onboarding checklist | App, Web | `/onboarding-exit/onboarding-checklist` | Tasks for HR, IT, the department and the new starter | D24-01 Start onboarding, S24-01 Onboarding list | Back only |
| <a id="s24-03"></a>S24-03 | My first days | App | `/onboarding-exit/my-first-days` | The new starter's checklist and welcome | Role home | Back only |
| <a id="s24-04"></a>S24-04 | Exit list | Web | `/onboarding-exit/exit-list` | People leaving and their exit progress | Role home | D24-02 Start exit |
| <a id="s24-05"></a>S24-05 | Exit checklist | App, Web | `/onboarding-exit/exit-checklist` | Return card, keys, assets and uniform, final pay and interview | D24-02 Start exit | D24-03 Clearance missing, S24-06 Exit interview |
| <a id="s24-06"></a>S24-06 | Exit interview | App | `/onboarding-exit/exit-interview` | Questions for the person leaving | S24-05 Exit checklist | Back only |
| <a id="s24-07"></a>S24-07 | Onboarding and exit settings | Web | `/onboarding-exit/onboarding-and-exit-settings` | Checklist items per role and exit type; Probation length per employment type; What former staff can still see | S24-01 Onboarding list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d24-01"></a>D24-01 | Start onboarding | Pick the template and start date | [S22-03 Add staff](22-hr-records.md#s22-03) |
| <a id="d24-02"></a>D24-02 | Start exit | Reason, last day and who is told | S24-04 Exit list |
| <a id="d24-03"></a>D24-03 | Clearance missing | Items not returned before final pay | S24-05 Exit checklist |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
