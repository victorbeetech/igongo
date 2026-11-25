# S29. Payslips & Lifetime Earnings

[All screens](README.md) · [Module spec](../../modules/29-earnings-statements.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s29-01"></a>S29-01 | My payslips | App | `/earnings-statements/my-payslips` | Every payslip, opened with PIN or fingerprint | Role home | D29-01 Unlock payslips, S29-03 Lifetime earnings, S29-05 Payslip settings |
| <a id="s29-02"></a>S29-02 | Payslip | App, Web | `/earnings-statements/payslip` | One payslip with earnings, deductions and net | D29-01 Unlock payslips | Back only |
| <a id="s29-03"></a>S29-03 | Lifetime earnings | App, Web | `/earnings-statements/lifetime-earnings` | Everything earned since joining, by year and type | S29-01 My payslips | S29-04 Earnings statement |
| <a id="s29-04"></a>S29-04 | Earnings statement | App, Web | `/earnings-statements/earnings-statement` | Downloadable statement for a period | S29-03 Lifetime earnings | D29-02 Download statement |
| <a id="s29-05"></a>S29-05 | Payslip settings | Web | `/earnings-statements/payslip-settings` | What a payslip shows, and the template; Whether staff can download PDFs, or only view; Whether former staff keep access, and for how long; Who can produce... | S29-01 My payslips | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d29-01"></a>D29-01 | Unlock payslips | PIN or fingerprint before showing pay | S29-01 My payslips |
| <a id="d29-02"></a>D29-02 | Download statement | Pick period and format | S29-04 Earnings statement |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
