# 24. Onboarding & Exit

**Group:** Staff · **Module key:** `onboarding-exit` · [All modules](README.md)

## Summary

Makes sure every new staff member is set up properly, and every leaver hands back everything and is paid correctly.

## Features

### Onboarding
- Checklists per role: documents collected, card issued, uniform issued, account created, training booked, policy sign-off.
- Tasks assigned to HR, IT, the store and the department head.
- Probation tracking with review reminders and confirm, extend or end decisions.
- Welcome message and first-day guide in the app.

### Exit
- Resignation, end of contract, retirement, dismissal and death, each with its own checklist.
- Clearance: card, keys, uniform, assets and advances, each signed off by the right department.
- Exit interview form.
- Final pay handed to [Payroll](28-payroll.md).
- Account switched to former staff, keeping access to their own payslips and earnings statement if allowed.

## Super admin options
- Checklist items per role and exit type.
- Probation length per employment type.
- What former staff can still see.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `onboarding.started`
- `onboarding.completed`
- `probation.due`
- `exit.started`
- `exit.cleared`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
