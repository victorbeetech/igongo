# 5. Audit Trail

**Group:** Core platform · **Module key:** `audit-trail` · [All modules](README.md)

## Summary

A permanent, tamper-proof record of every action in every module: who did it, what changed, when, where and from which device. This is how the hotel answers "who did this two years ago".

## Features
- Records create, edit, delete, approve, view-of-sensitive-data, login, export and print actions.
- Stores old and new values for every changed field.
- Stores the person, role used, device, station, IP address, GPS (if allowed) and app version.
- Append-only storage with a hash chain, so any tampering is detectable.
- Search by person, module, record, date range, action type or value.
- Timeline view of one record's full life, such as one staff member or one booking.
- Undo a change where the module supports it, which itself is logged.
- Alerts on suspicious patterns, such as mass deletes, exports at night, or many failed approvals.
- Export to PDF or spreadsheet, with the export itself logged.

## Super admin options
- Which actions trigger an alert, and who receives it.
- Whether "viewed" events are logged for sensitive screens such as payroll.
- Which roles can search the audit trail, and in which modules.
- Retention: forever by default, with legal holds.


## Depends on

- Only the core platform services that every module uses (login, permissions and the audit trail).

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `audit.alert_raised`
- `audit.exported`

## If this module is switched off or fails

Cannot be switched off. If writing fails, the action is refused rather than done without a record.
