# 1. Super Admin Console

**Group:** Core platform · **Module key:** `super-admin` · [All modules](README.md)

## Summary

The control room for the whole system. Everything the hotel will ever want to change, from a module being on or off to the wording of a button, is changed here by the super admin, with no code changes and no app update.

## Features

### Module control
- Turn any module on or off for the whole hotel, one location, one department or one role.
- Maintenance mode for a single module, with a message shown to users while it is down.
- Health page for every module: status, last error, response time and queued jobs.
- Feature flags inside each module, so a single feature can be tried by a pilot group first.

### Hotel settings
- Hotel profile: name, logo, addresses, contact numbers, TIN and registration details.
- Working week, business day cut-off time and time zone.
- Currency, number and date formats.
- Financial year start and payroll period.

### Safety for the super admin
- Every change shows a preview and asks for confirmation before it goes live.
- Every change is written to the [Audit Trail](05-audit-trail.md) with old and new values, and can be undone in one click.
- Change sets: group several changes, schedule them for a date and time, and roll the whole set back together.
- Two super admins can be required to approve risky changes (dual control), such as payroll rules or deleting a role.
- Break-glass account that is sealed, alarmed and used only when every other super admin is locked out.

### System tools
- Global announcement banner across all apps.
- Force an app update when a minimum version is required.
- Background job monitor with retry and cancel.
- Sandbox copy of settings to try changes before applying them to the live system.

## Super admin options
- Who else can open the console, and which sections each of them sees.
- Which changes need dual approval.
- How long undo history is kept (default: forever).
- Whether scheduled change sets are allowed.
- Maintenance message wording for each module.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Audit Trail](05-audit-trail.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `module.enabled`
- `module.disabled`
- `module.maintenance_started`
- `module.maintenance_ended`
- `settings.changed`
- `changeset.applied`
- `changeset.rolled_back`

## If this module is switched off or fails

This module cannot be switched off. If it fails, every other module keeps running on its last saved settings.
