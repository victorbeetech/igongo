# 8. Forms & Templates Builder

**Group:** Core platform · **Module key:** `forms-builder` · [All modules](README.md)

## Summary

A drag-and-drop builder for every form, checklist and report template in the hotel: daily reports, inspections, fault reports, applications, feedback forms and more.

## Features
- Drag-and-drop form designer with sections, pages and repeatable groups.
- Field types as in [Custom Fields](07-custom-fields.md), plus rating stars, scoring, photo with annotation, video, voice note, barcode/QR scan and NFC tap.
- Conditional logic: show, hide, require or score questions based on answers.
- Scoring with pass marks for checklists and inspections.
- Versions: changing a form never changes the answers already submitted.
- Templates library, cloning, and import/export of form designs.
- Offline filling with sync later.
- Print layouts and PDF output for any form.
- Public forms for clients, such as an event enquiry or feedback form, with spam protection.

## Super admin options
- Who can design forms, and who can publish them.
- Which module each form is attached to.
- Who can fill each form, and how often (daily, per shift, per event).
- Deadlines and reminders for recurring forms.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `form.published`
- `form.submitted`
- `form.overdue`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
