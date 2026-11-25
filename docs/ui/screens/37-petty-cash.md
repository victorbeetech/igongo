# S37. Petty Cash & Expense Claims

[All screens](README.md) · [Module spec](../../modules/37-petty-cash.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s37-01"></a>S37-01 | My claims | App | `/petty-cash/my-claims` | Expense claims and petty cash requests | Role home | S37-02 New claim, S37-06 Petty cash settings |
| <a id="s37-02"></a>S37-02 | New claim | App | `/petty-cash/new-claim` | Amount, category, receipt photo and cost centre | S37-01 My claims | Back only |
| <a id="s37-03"></a>S37-03 | Claims to approve | App, Web | `/petty-cash/claims-to-approve` | Claims waiting for approval | Role home | D37-01 Approve claim, S37-04 Petty cash box |
| <a id="s37-04"></a>S37-04 | Petty cash box | App, Web | `/petty-cash/petty-cash-box` | Float, payments, top-ups and balance | Role home, S37-03 Claims to approve | S37-05 Cash count |
| <a id="s37-05"></a>S37-05 | Cash count | App, Web | `/petty-cash/cash-count` | Count the box and record any difference | S37-04 Petty cash box | Back only |
| <a id="s37-06"></a>S37-06 | Petty cash settings | Web | `/petty-cash/petty-cash-settings` | Floats and spending limits per department; Approval tiers; Expense categories | S37-01 My claims | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d37-01"></a>D37-01 | Approve claim | Approve or return with comment | S37-03 Claims to approve |
| <a id="d37-02"></a>D37-02 | Pay claim | Pay from petty cash or payroll | D37-01 Approve claim |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
