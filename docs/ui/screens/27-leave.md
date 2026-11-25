# S27. Leave Management

[All screens](README.md) · [Module spec](../../modules/27-leave.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s27-01"></a>S27-01 | My leave | App | `/leave/my-leave` | Balances, requests and history | Role home | D27-01 Cancel leave, S27-02 Request leave |
| <a id="s27-02"></a>S27-02 | Request leave | App | `/leave/request-leave` | Type, dates, reason and attachment | S27-01 My leave | D27-02 Leave clash |
| <a id="s27-03"></a>S27-03 | Leave requests | App, Web | `/leave/leave-requests` | Requests waiting for approval | Role home | S27-04 Leave calendar, S27-05 Leave types |
| <a id="s27-04"></a>S27-04 | Leave calendar | App, Web | `/leave/leave-calendar` | Who is away, by department | Role home, S27-03 Leave requests | Back only |
| <a id="s27-05"></a>S27-05 | Leave types | Web | `/leave/leave-types` | Annual, sick, maternity and others, with rules | S27-03 Leave requests | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d27-01"></a>D27-01 | Cancel leave | Confirm cancelling a request | S27-01 My leave |
| <a id="d27-02"></a>D27-02 | Leave clash | Warn when too many in a department are away | S27-02 Request leave |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
