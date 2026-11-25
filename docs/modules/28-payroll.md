# 28. Payroll

**Group:** Staff · **Module key:** `payroll` · [All modules](README.md)

## Summary

Calculates and runs pay each period. It reads approved hours from attendance and deductions from advances, but keeps its own records, so a payroll problem never affects HR or attendance.

## Features

### Pay setup
- Pay structures: monthly, daily, hourly and piece rate for casuals.
- Allowances (transport, housing, night, acting) and deductions, fixed or calculated.
- Statutory deductions: PAYE, NSSF (employee and employer) and LST, with editable rates.
- Bank and mobile money payment details from HR records.

### Pay run
- Draft run built from approved attendance, overtime, advances, loans and bonuses.
- Variance check against last period, with warnings for big changes.
- Review and approval through a workflow.
- Lock the period once approved.
- Bulk payment file for the bank, or bulk mobile money payment.
- Off-cycle runs for final pay and corrections.

### Outputs
- Payslips sent to [Payslips & Lifetime Earnings](29-earnings-statements.md).
- Statutory reports: NSSF schedule, PAYE return and LST.
- Payroll journal for [Accounting Export](80-accounting-export.md).

### Confidentiality
- Payroll is visible only to roles the super admin allows (by default the GM and payroll staff).
- Every view of salary data is logged.

## Super admin options
- Pay elements, formulas and statutory rates.
- Pay periods and cut-off dates.
- Who can prepare, review, approve and release a pay run.
- Which roles may see salaries, and at what scope.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `payroll.run_created`
- `payroll.run_approved`
- `payroll.run_paid`
- `payroll.period_locked`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
