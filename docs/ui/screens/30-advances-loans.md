# S30. Advances & Loans

[All screens](README.md) · [Module spec](../../modules/30-advances-loans.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s30-01"></a>S30-01 | My advances | App | `/advances-loans/my-advances` | Balances, requests and repayments | Role home | S30-02 Request advance |
| <a id="s30-02"></a>S30-02 | Request advance | App | `/advances-loans/request-advance` | Amount, reason and repayment plan, within the limit | S30-01 My advances | D30-02 Over limit |
| <a id="s30-03"></a>S30-03 | Advance requests | App, Web | `/advances-loans/advance-requests` | Requests waiting for approval | Role home | D30-01 Approve advance, S30-04 Loans, S30-06 Advance rules |
| <a id="s30-04"></a>S30-04 | Loans | Web | `/advances-loans/loans` | Staff loans with balances and schedules | S30-03 Advance requests | S30-05 Loan detail |
| <a id="s30-05"></a>S30-05 | Loan detail | App, Web | `/advances-loans/loan-detail/:id` | One loan with repayments | S30-04 Loans | Back only |
| <a id="s30-06"></a>S30-06 | Advance rules | Web | `/advances-loans/advance-rules` | Limits, repayment rules and approval tiers | S30-03 Advance requests | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d30-01"></a>D30-01 | Approve advance | Approve with amount and repayment months | S30-03 Advance requests |
| <a id="d30-02"></a>D30-02 | Over limit | Explain the limit and options | S30-02 Request advance |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
