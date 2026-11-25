# 56. Feedback, Complaints & Reviews

**Group:** Guests and sales · **Module key:** `guest-feedback` · [All modules](README.md)

## Summary

Collects guest feedback after every service, handles complaints to the end, and tracks reviews.

## Features
- Automatic feedback request after a stay, meal, event, tour, pool visit or spa treatment.
- Star ratings and comments, per service and per staff member if wanted.
- Complaint tickets with owner, deadline, actions and resolution.
- Escalation of low ratings to the manager straight away.
- Thank-you or apology messages, with an optional voucher.
- Review link to Google and booking sites for happy guests.
- Satisfaction scores by department over time.

## Super admin options
- Which services ask for feedback, and when.
- Questions per service.
- What rating counts as a complaint.
- Who handles complaints per department.


## Depends on

- [CRM: Guest & Client Profiles](54-crm-guests.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `feedback.received`
- `complaint.opened`
- `complaint.resolved`
- `rating.low`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
