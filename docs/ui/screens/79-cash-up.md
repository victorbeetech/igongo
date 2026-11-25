# S79. Cash-up & Reconciliation

[All screens](README.md) · [Module spec](../../modules/79-cash-up.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s79-01"></a>S79-01 | Cash-up | App, Kiosk | `/cash-up/cash-up` | Count cash by note, with expected totals | Role home, [S77-10 Till](77-payments.md#s77-10) | D79-01 Submit cash-up, D79-02 Variance found, S79-05 Cash-up settings |
| <a id="s79-02"></a>S79-02 | Cash-ups | Web | `/cash-up/cash-ups` | Cash-ups by cashier, rider and outlet with variances | Role home | S79-03 Cash-up detail |
| <a id="s79-03"></a>S79-03 | Cash-up detail | Web | `/cash-up/cash-up-detail/:id` | Counts, expected, variance and sign-off | S79-02 Cash-ups | Back only |
| <a id="s79-04"></a>S79-04 | Open till | App, Kiosk | `/cash-up/open-till` | Start a till shift with an opening float | Role home | [S77-10 Till](77-payments.md#s77-10) |
| <a id="s79-05"></a>S79-05 | Cash-up settings | Web | `/cash-up/cash-up-settings` | Allowed variance before an alert; Who signs off cash-ups; Whether a cashier can see expected totals before counting (blind cash-up) | S79-01 Cash-up | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d79-01"></a>D79-01 | Submit cash-up | Confirm the count and sign | S79-01 Cash-up |
| <a id="d79-02"></a>D79-02 | Variance found | Reason required above the limit | S79-01 Cash-up |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
