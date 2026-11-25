# 2. Roles & Permissions

**Group:** Core platform · **Module key:** `roles-permissions` · [All modules](README.md)

## Summary

The role builder. Roles such as Chef, Lifeguard or Board Member are data that the super admin creates, never code. Each role says what a person can do in every module, which records they can see, and what their app looks like.

## Features

### Role builder
- Create a role with a name, colour, icon, description and the department it belongs to.
- Start from a blank role, from a pre-made role in [the roles spec](../roles/README.md), or by cloning any existing role.
- Give one person several roles at once. Their permissions are combined.
- Temporary roles with a start and end date, such as "Acting GM for two weeks".
- Role hierarchy, so a manager role can automatically see what the roles under it see.

### Permissions
- For every feature in every module: view, create, edit, approve, delete, export, comment and like, each on or off.
- Field-level control: hide or make read-only any single field, such as salary or a guest's phone number.
- Data scope for each permission: everything, own location, own department, own team, assigned to me or own records only.
- Approval limits on amounts and counts, using tiers (Tier 1, 2, 3 or unlimited) whose amounts the super admin sets.

### Conditions
- Time windows, such as "can sell pool passes only 8 AM to 7 PM".
- Device and station limits, such as "can only clock others in from the gate handheld".
- Location limits, using GPS or the network the device is on.
- Require 2FA, a card tap or a PIN before a sensitive action.

### Testing and safety
- "View as" a role or a person, to see exactly what their app shows before saving.
- Compare two roles side by side.
- A permission report: who can do X, and why (which role gave it).
- Separation of duties rules, such as "the person who creates a payment cannot approve it".

## Super admin options
- Create, edit, clone, archive and delete roles.
- Default role given to every new staff account, and to every new client account.
- Which roles may be assigned by department managers, and which only by the super admin.
- The amounts behind approval tiers 1, 2 and 3.
- Whether a person with several roles sees one combined home screen or switches between roles.


## Depends on

- [Users, Accounts & Login](04-users-login.md)
- [Audit Trail](05-audit-trail.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `role.created`
- `role.updated`
- `role.archived`
- `role.assigned`
- `role.unassigned`
- `permission.denied`

## If this module is switched off or fails

Cannot be switched off. If it fails, the apps keep the last permissions they downloaded and refuse new sensitive actions until it is back.
