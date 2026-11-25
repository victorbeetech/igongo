# 23. Recruitment

**Group:** Staff · **Module key:** `recruitment` · [All modules](README.md)

## Summary

Runs hiring, from a department's request for a new person to an accepted offer.

## Features
- Staffing requests from department heads, sent for approval.
- Job posts with description, requirements and closing date, published in the app, on the website and by WhatsApp.
- Online application form with CV upload.
- Applicant pipeline board: applied, shortlisted, interview, offer, hired, rejected.
- Interview scheduling with panel members, scorecards and notes.
- Offer letters from templates.
- Talent pool of past applicants.
- Hand-off to [Onboarding & Exit](24-onboarding-exit.md) and [HR Staff Records](22-hr-records.md) when hired.

## Super admin options
- Pipeline stages and scorecard questions.
- Who approves staffing requests and offers.
- Application form fields.
- Whether rejected applicants get an automatic message.


## Depends on

- [Workflow & Approvals](09-workflow-approvals.md)
- [Forms & Templates Builder](08-forms-builder.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `vacancy.requested`
- `vacancy.approved`
- `application.received`
- `applicant.stage_changed`
- `applicant.hired`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
