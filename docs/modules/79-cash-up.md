# 79. Cash-up & Reconciliation

**Group:** Money and insight · **Module key:** `cash-up` · [All modules](README.md)

## Summary

End-of-shift cash-up for every cashier, rider and outlet, with variances flagged.

## Features
- Shift open with a starting float.
- Expected takings per method calculated from payments.
- Cashier counts cash by denomination and enters mobile money and card totals.
- Variance shown and explained, with supervisor sign-off.
- Rider cash hand-in.
- Safe drops and bank deposits.
- Daily outlet summary to accounts.
- Variance trends per cashier.

## Super admin options
- Allowed variance before an alert.
- Who signs off cash-ups.
- Whether a cashier can see expected totals before counting (blind cash-up).


## Depends on

- [Payments](77-payments.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `shift.opened`
- `cashup.submitted`
- `cashup.approved`
- `cashup.variance`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
