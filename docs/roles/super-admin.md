# Super Admin

**Level:** System · **Role key:** `super-admin` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Controls and configures the whole system: modules, roles, permissions, screens, forms, workflows, prices, wording and integrations. Does not run daily hotel work.

**Uses:** Web portal for setup, and the Igongo app for testing roles and the client view

## Home screen tiles

- Module health
- Pending change sets
- Role builder
- Recent audit alerts
- Integrations status
- Devices offline

## Modules, screens and default permissions

| Module | Actions | Data scope |
| --- | --- | --- |
| [Super Admin Console](../modules/01-super-admin.md) | view, create, edit, approve, delete, export | Everything |
| [Roles & Permissions](../modules/02-roles-permissions.md) | view, create, edit, approve, delete, export | Everything |
| [App Layout & Navigation](../modules/03-app-builder.md) | view, create, edit, approve, delete, export | Everything |
| [Users, Accounts & Login](../modules/04-users-login.md) | view, create, edit, approve, delete, export | Everything |
| [Audit Trail](../modules/05-audit-trail.md) | view, export | Everything |
| [Records Archive & Search](../modules/06-records-search.md) | view, export | Everything |
| [Custom Fields](../modules/07-custom-fields.md) | view, create, edit, delete | Everything |
| [Forms & Templates Builder](../modules/08-forms-builder.md) | view, create, edit, delete | Everything |
| [Workflow & Approvals](../modules/09-workflow-approvals.md) | view, create, edit, delete | Everything |
| [Notifications Engine](../modules/10-notifications.md) | view, create, edit, delete | Everything |
| [Files & Media](../modules/11-files-media.md) | view, create, edit, delete | Everything |
| [Languages, Wording & Branding](../modules/12-languages-wording.md) | view, create, edit, delete | Everything |
| [Data Import, Export & Backup](../modules/13-data-import-export.md) | view, create, edit, export | Everything |
| [Integrations Hub & Webhooks](../modules/14-integrations-hub.md) | view, create, edit, delete | Everything |
| [Locations & Departments](../modules/15-locations-departments.md) | view, create, edit, delete | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, create, edit, approve | Everything |
| [Devices & Stations](../modules/18-devices-stations.md) | view, create, edit, delete | Everything |

**Main screens:** Super Admin Console, Role builder, App layout editor, Form and workflow builders, Notification rules, Integrations, Audit search

## Approval limits

- Approves system changes only. Risky changes (payroll rules, deleting a role) need a second super admin when dual control is on.

## Extra rules

- 2FA required on every login.
- Access only from registered devices.
- Cannot see salary amounts or approve payments unless also given a finance role.
- Every action is logged and can be undone.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
