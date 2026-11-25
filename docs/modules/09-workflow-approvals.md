# 9. Workflow & Approvals

**Group:** Core platform · **Module key:** `workflow-approvals` · [All modules](README.md)

## Summary

A builder for every approval chain and process in the hotel: who approves what, in what order, and what happens next. Any module can hand a request to this module.

## Features
- Visual workflow builder with steps, conditions, parallel approvals and loops back for changes.
- Approver by role, by person, by the requester's manager or by department head.
- Conditions on amount, department, type, time or any field.
- Escalation when a step waits too long, with reminders first.
- Delegation when an approver is away, with start and end dates.
- Approve or reject from a notification, the app, WhatsApp or the web, with a reason.
- Bulk approval for managers with many requests.
- Full history of every decision, kept for ever.
- SLA reports: how long approvals take, per step and per person.

## Super admin options
- Create and edit workflows for any request type in any module.
- Escalation times and who is escalated to.
- Whether an approver can approve their own request (default: never).
- Whether rejected requests can be resubmitted.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `approval.requested`
- `approval.approved`
- `approval.rejected`
- `approval.escalated`
- `approval.delegated`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
