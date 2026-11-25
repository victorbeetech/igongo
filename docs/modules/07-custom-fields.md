# 7. Custom Fields

**Group:** Core platform · **Module key:** `custom-fields` · [All modules](README.md)

## Summary

Lets the super admin add new fields to any record in any module, such as "Shoe size" on staff, "Dietary needs" on guests or "Allergy note" on orders, with no code.

## Features
- Field types: text, number, money, date, time, yes/no, list, multi-select, phone, email, photo, file, signature, GPS location and link to another record.
- Required, optional or conditional fields ("show only if department is Kitchen").
- Validation rules, default values and help text.
- Field groups and sections on screens.
- Field-level permissions through [Roles & Permissions](02-roles-permissions.md).
- Fields are searchable, reportable and exportable like built-in fields.
- Field history kept in the audit trail.

## Super admin options
- Add, edit, reorder, retire or delete fields on any record type.
- Which roles see or edit each field.
- Whether a field appears in the client view.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `customfield.created`
- `customfield.updated`
- `customfield.retired`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
