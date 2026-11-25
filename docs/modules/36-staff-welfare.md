# 36. Staff Requests & Welfare

**Group:** Staff · **Module key:** `staff-welfare` · [All modules](README.md)

## Summary

Everyday requests and welfare: uniforms, letters, grievances, welfare contributions and staff support.

## Features
- Requests from the app: introduction letter, salary confirmation, uniform, ID replacement and any custom request type.
- Uniform issue records with sizes, dates and returns.
- Grievance reporting, with an anonymous option.
- Welfare fund contributions and support payouts, if the hotel runs one.
- Birthdays, work anniversaries and condolence messages.
- Staff suggestion box.

## Super admin options
- Request types and who handles each.
- Whether anonymous grievances are allowed.
- Welfare fund rules.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `staffrequest.created`
- `staffrequest.completed`
- `grievance.reported`
- `uniform.issued`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
