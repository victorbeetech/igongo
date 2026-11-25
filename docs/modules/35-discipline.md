# 35. Discipline & Cases

**Group:** Staff · **Module key:** `discipline` · [All modules](README.md)

## Summary

A confidential file of incidents, warnings, hearings and outcomes, handled fairly and kept permanently.

## Features
- Record an incident with date, people involved, witnesses and evidence (photos, files).
- Case steps: investigation, show-cause letter, hearing, decision and appeal.
- Warning letters from templates, with expiry of warnings.
- Staff member can see and acknowledge their own case documents.
- Access limited to HR and named people only.
- Case history kept for ever.

## Super admin options
- Offence categories and suggested actions.
- Case steps and letter templates.
- Who can open, see and close cases.
- Warning expiry periods.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Files & Media](11-files-media.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `case.opened`
- `case.hearing_scheduled`
- `case.closed`
- `warning.issued`
- `warning.expired`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
