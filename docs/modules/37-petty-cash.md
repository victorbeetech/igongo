# 37. Petty Cash & Expense Claims

**Group:** Staff · **Module key:** `petty-cash` · [All modules](README.md)

## Summary

Controls small cash spending and staff expense claims, with receipts and approvals.

## Features
- Petty cash floats per department, with a balance.
- Spend records with a photo of the receipt.
- Expense claims by staff, with approval and refund.
- Top-up requests when a float runs low.
- Monthly petty cash reconciliation.
- Categories mapped to accounting codes.

## Super admin options
- Floats and spending limits per department.
- Approval tiers.
- Expense categories.


## Depends on

- [Workflow & Approvals](09-workflow-approvals.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `expense.submitted`
- `expense.approved`
- `expense.paid`
- `float.low`
- `float.reconciled`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
