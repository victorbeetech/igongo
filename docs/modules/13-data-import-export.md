# 13. Data Import, Export & Backup

**Group:** Core platform · **Module key:** `data-import-export` · [All modules](README.md)

## Summary

Moves data in and out of the system safely: importing existing staff lists and spreadsheets, exporting reports, and keeping backups.

## Features
- Import from spreadsheet with column mapping, preview and a dry run that shows errors first.
- Import templates for staff, guests, menus, assets, wristbands and opening balances.
- Bulk update by spreadsheet, logged in the audit trail.
- Export any list the person can see, as PDF, Excel or CSV.
- Scheduled exports sent to chosen people.
- Daily automatic backups, with point-in-time restore.
- Restore a single deleted record without restoring the whole database.

## Super admin options
- Which roles may import and export, per module.
- Whether exports are watermarked or need approval.
- Backup schedule and how long backups are kept.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `import.completed`
- `import.failed`
- `export.created`
- `backup.completed`
- `backup.failed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
