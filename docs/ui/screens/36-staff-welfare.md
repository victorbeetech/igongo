# S36. Staff Requests & Welfare

[All screens](README.md) · [Module spec](../../modules/36-staff-welfare.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s36-01"></a>S36-01 | My requests | App | `/staff-welfare/my-requests` | Requests to HR and welfare, with status | Role home | S36-02 New request, S36-05 Requests and welfare settings |
| <a id="s36-02"></a>S36-02 | New request | App | `/staff-welfare/new-request` | Type, details and attachment | S36-01 My requests | Back only |
| <a id="s36-03"></a>S36-03 | Requests inbox | App, Web | `/staff-welfare/requests-inbox` | Requests to handle, by type and age | Role home | D36-01 Close request, S36-04 Welfare fund |
| <a id="s36-04"></a>S36-04 | Welfare fund | Web | `/staff-welfare/welfare-fund` | Contributions and support given | S36-03 Requests inbox | Back only |
| <a id="s36-05"></a>S36-05 | Requests and welfare settings | Web | `/staff-welfare/requests-and-welfare-settings` | Request types and who handles each; Whether anonymous grievances are allowed; Welfare fund rules | S36-01 My requests | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d36-01"></a>D36-01 | Close request | Outcome and message | S36-03 Requests inbox |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
