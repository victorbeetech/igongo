# 30. Advances & Loans

**Group:** Staff · **Module key:** `advances-loans` · [All modules](README.md)

## Summary

Salary advances and staff loans, from request to the last deduction.

## Features
- Request an advance from the app, with the amount available shown first.
- Limits by grade, by percentage of salary or by number of requests per period.
- Approval through a workflow, with approval tiers.
- Payout by mobile money, bank or cash, recorded.
- Loans with repayment schedules, interest (if any) and guarantors.
- Automatic deduction from payroll each period.
- Statement of each advance and loan, with balance.
- Pause or reschedule repayments with approval.

## Super admin options
- Limits and eligibility rules (for example, not during probation).
- Approval tiers and workflow.
- Repayment rules and maximum terms.
- Cut-off day for advances each month.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Workflow & Approvals](09-workflow-approvals.md)
- [Payroll](28-payroll.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `advance.requested`
- `advance.approved`
- `advance.paid`
- `loan.created`
- `repayment.deducted`
- `loan.cleared`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
