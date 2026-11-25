# S60. Guest Requests & Help Desk

[All screens](README.md) · [Module spec](../../modules/60-guest-requests.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s60-01"></a>S60-01 | Request help | App | `/guest-requests/request-help` | Guest picks a request type: towels, cleaning, wake-up call and more | [S00-23 Client view home](00-app-shell.md#s00-23) | S60-02 My requests, S60-05 Guest request settings |
| <a id="s60-02"></a>S60-02 | My requests | App | `/guest-requests/my-requests` | Guest's requests with live status | S60-01 Request help, [S44-02 Guest laundry request](44-laundry.md#s44-02) | D60-01 Rate service |
| <a id="s60-03"></a>S60-03 | Requests board | App, Web | `/guest-requests/requests-board` | Staff view of requests by department and target time | Role home | D60-02 Late request, S60-04 Request detail |
| <a id="s60-04"></a>S60-04 | Request detail | App, Web | `/guest-requests/request-detail/:id` | Notes, status and who is handling it | S60-03 Requests board | Back only |
| <a id="s60-05"></a>S60-05 | Guest request settings | Web | `/guest-requests/guest-request-settings` | Request types, routing rules and target times; Which requests guests can make in the app | S60-01 Request help | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d60-01"></a>D60-01 | Rate service | Guest rates the request when done | S60-02 My requests |
| <a id="d60-02"></a>D60-02 | Late request | Alert when a request is past its target time | S60-03 Requests board |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
