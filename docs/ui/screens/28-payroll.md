# S28. Payroll

[All screens](README.md) · [Module spec](../../modules/28-payroll.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s28-01"></a>S28-01 | Payroll home | Web | `/payroll/payroll-home` | Current run status, totals and deadlines | Role home | D28-01 Start pay run, S28-02 Pay runs, S28-06 Pay items, S28-07 Statutory settings, S28-09 Payroll reports |
| <a id="s28-02"></a>S28-02 | Pay runs | Web | `/payroll/pay-runs` | Every run, open, approved and paid | S28-01 Payroll home | S28-03 Pay run detail |
| <a id="s28-03"></a>S28-03 | Pay run detail | Web | `/payroll/pay-run-detail/:id` | Every person's gross, deductions and net, with changes from last month | S28-02 Pay runs | D28-03 Lock pay run, D28-04 Reverse pay run, S28-08 Bank and mobile money file |
| <a id="s28-04"></a>S28-04 | Pay run review | Web | `/payroll/pay-run-review` | Variances, new starters, leavers and warnings | Role home, S28-05 Hours to import | D28-02 Approve pay run |
| <a id="s28-05"></a>S28-05 | Hours to import | Web | `/payroll/hours-to-import` | Approved attendance and overtime to bring into the pay run | D28-01 Start pay run, Role home | S28-04 Pay run review |
| <a id="s28-06"></a>S28-06 | Pay items | Web | `/payroll/pay-items` | Earnings and deductions with their rules | S28-01 Payroll home | Back only |
| <a id="s28-07"></a>S28-07 | Statutory settings | Web | `/payroll/statutory-settings` | PAYE, NSSF and LST rules as data | S28-01 Payroll home | Back only |
| <a id="s28-08"></a>S28-08 | Bank and mobile money file | Web | `/payroll/bank-and-mobile-money-file` | Payment files for the bank or mobile money | S28-03 Pay run detail | Back only |
| <a id="s28-09"></a>S28-09 | Payroll reports | Web | `/payroll/payroll-reports` | Totals by department, cost centre and period | S28-01 Payroll home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d28-01"></a>D28-01 | Start pay run | Choose the month and the people | S28-01 Payroll home |
| <a id="d28-02"></a>D28-02 | Approve pay run | Approve with second approver if required | S28-04 Pay run review |
| <a id="d28-03"></a>D28-03 | Lock pay run | Confirm no more changes | S28-03 Pay run detail |
| <a id="d28-04"></a>D28-04 | Reverse pay run | Reason and approval | S28-03 Pay run detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
