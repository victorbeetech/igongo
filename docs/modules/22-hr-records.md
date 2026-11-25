# 22. HR Staff Records

**Group:** Staff · **Module key:** `hr-records` · [All modules](README.md)

## Summary

The master record for every staff member, from enrolment to exit. Other staff modules read the person from here but keep their own data, so HR records stay safe if payroll or attendance has a problem.

## Features

### Enrolment
- Personal details, photo, national ID, NSSF and TIN numbers, bank and mobile money details.
- Next of kin, emergency contacts, address and home district.
- Education, previous employers and references.
- Medical fitness certificate, especially for food handlers.

### Employment
- Staff number, job title, department, grade, employment type (permanent, contract, casual, intern) and start date.
- Contract documents, with renewal and expiry reminders.
- Reporting line (manager), feeding the organisation chart.
- Transfers, promotions, acting appointments and grade changes, each with an effective date.

### Documents
- Store ID copies, certificates, contracts and letters, with expiry alerts.
- Generate letters from templates: appointment, confirmation, transfer, introduction and certificate of service.

### History
- A timeline of every change to the person's employment.
- Years of service and long service milestones.

## Super admin options
- Required fields per employment type, and extra fields through [Custom Fields](07-custom-fields.md).
- Staff number format.
- Which fields staff can update themselves and which need HR approval.
- Who can see sensitive fields such as ID, bank details and medical records.
- Letter templates.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Files & Media](11-files-media.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `staff.enrolled`
- `staff.updated`
- `staff.transferred`
- `staff.promoted`
- `staff.contract_expiring`
- `staff.exited`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
