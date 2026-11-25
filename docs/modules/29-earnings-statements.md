# 29. Payslips & Lifetime Earnings

**Group:** Staff · **Module key:** `earnings-statements` · [All modules](README.md)

## Summary

Gives every staff member their payslips and a lifetime earnings statement: everything they have earned from Igongo since they joined, even five or ten years back.

## Features
- Payslips in the app, as PDF, by period.
- Lifetime earnings statement: total pay, allowances, bonuses, deductions, advances and net pay, by year and in total.
- Statement for any date range, such as for a bank loan application.
- Verified statements with a QR code that a bank can check.
- Tax and NSSF summaries per year.
- Former staff can still get their statements, if allowed.
- PIN or fingerprint needed to open payslips.

## Super admin options
- What a payslip shows, and the template.
- Whether staff can download PDFs, or only view.
- Whether former staff keep access, and for how long.
- Who can produce statements for other staff.


## Depends on

- [Payroll](28-payroll.md)
- [HR Staff Records](22-hr-records.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `payslip.published`
- `statement.generated`
- `statement.verified`

## If this module is switched off or fails

Payroll still runs. Payslips are generated when this module comes back.
