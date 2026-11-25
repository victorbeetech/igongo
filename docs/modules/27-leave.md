# 27. Leave Management

**Group:** Staff · **Module key:** `leave` · [All modules](README.md)

## Summary

Leave requests, balances and approvals, for every leave type the hotel uses.

## Features
- Leave types: annual, sick, maternity, paternity, compassionate, study, unpaid and any custom type.
- Balances that build up monthly, with carry-forward and expiry rules.
- Request from the app with dates, reason and attachment (such as a sick note).
- Approval through [Workflow & Approvals](09-workflow-approvals.md).
- Team leave calendar, with clashes highlighted.
- Handover note and acting person during leave.
- Return to work confirmation.
- Leave history kept for ever.

## Super admin options
- Leave types, entitlement per grade, accrual and carry-forward rules.
- Blackout dates when leave is not allowed, such as big events.
- How many people in a team can be away at once.
- Approval chains per leave type.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `leave.requested`
- `leave.approved`
- `leave.rejected`
- `leave.started`
- `leave.ended`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
