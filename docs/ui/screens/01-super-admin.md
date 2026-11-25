# S01. Super Admin Console

[All screens](README.md) · [Module spec](../../modules/01-super-admin.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s01-01"></a>S01-01 | Console home | Web | `/super-admin/console-home` | Module health, pending change sets and alerts | Role home | S01-02 Modules list, S01-05 Hotel profile, S01-06 Business settings, S01-07 Change sets, S01-10 Dual approval queue, S01-11 Global banner, S01-12 App versions, S01-15 Break-glass access, [S02-01 Roles list](02-roles-permissions.md#s02-01), [S03-01 Layout editor](03-app-builder.md#s03-01), [S04-01 Accounts list](04-users-login.md#s04-01), [S05-01 Audit search](05-audit-trail.md#s05-01), [S06-01 Archive policies](06-records-search.md#s06-01), [S07-01 Record types](07-custom-fields.md#s07-01), [S08-01 Forms library](08-forms-builder.md#s08-01), [S09-01 Workflows list](09-workflow-approvals.md#s09-01), [S10-01 Notification rules](10-notifications.md#s10-01), [S11-01 File browser](11-files-media.md#s11-01), [S12-01 Wording editor](12-languages-wording.md#s12-01), [S13-01 Import wizard](13-data-import-export.md#s13-01), [S14-01 Integrations](14-integrations-hub.md#s14-01), [S15-01 Organisation chart](15-locations-departments.md#s15-01) |
| <a id="s01-02"></a>S01-02 | Modules list | Web | `/super-admin/modules-list` | Every module with on, off and maintenance switches | S01-01 Console home | D01-04 Maintenance mode, S01-03 Module settings, S01-04 Module health |
| <a id="s01-03"></a>S01-03 | Module settings | Web | `/super-admin/module-settings` | Settings and feature flags for one module | S01-02 Modules list | D01-01 Turn module off |
| <a id="s01-04"></a>S01-04 | Module health | Web | `/super-admin/module-health` | Status, errors, response time and queued jobs for one module | Role home, S01-02 Modules list | S01-13 Background jobs |
| <a id="s01-05"></a>S01-05 | Hotel profile | Web | `/super-admin/hotel-profile/:id` | Name, logos, addresses, TIN and contacts | S01-01 Console home | Back only |
| <a id="s01-06"></a>S01-06 | Business settings | Web | `/super-admin/business-settings` | Working week, cut-off time, time zone, currency, formats, financial year | S01-01 Console home | S01-09 Change preview |
| <a id="s01-07"></a>S01-07 | Change sets | Web | `/super-admin/change-sets` | Grouped changes, scheduled or applied, with roll back | Role home, S01-01 Console home | S01-08 Change set detail |
| <a id="s01-08"></a>S01-08 | Change set detail | Web | `/super-admin/change-set-detail/:id` | Every change in a set with old and new values | S01-07 Change sets, S01-10 Dual approval queue | D01-02 Apply change set, D01-03 Roll back |
| <a id="s01-09"></a>S01-09 | Change preview | Web | `/super-admin/change-preview` | What a change will do before it goes live | S01-06 Business settings | S01-14 Sandbox |
| <a id="s01-10"></a>S01-10 | Dual approval queue | Web | `/super-admin/dual-approval-queue` | Risky changes waiting for a second super admin | S01-01 Console home | S01-08 Change set detail |
| <a id="s01-11"></a>S01-11 | Global banner | Web | `/super-admin/global-banner` | Write a banner shown across all apps | S01-01 Console home | Back only |
| <a id="s01-12"></a>S01-12 | App versions | Web | `/super-admin/app-versions` | Minimum app version and force update | S01-01 Console home | Back only |
| <a id="s01-13"></a>S01-13 | Background jobs | Web | `/super-admin/background-jobs` | Running and failed jobs with retry and cancel | S01-04 Module health | Back only |
| <a id="s01-14"></a>S01-14 | Sandbox | Web | `/super-admin/sandbox` | Try settings on a copy before applying them | S01-09 Change preview | Back only |
| <a id="s01-15"></a>S01-15 | Break-glass access | Web | `/super-admin/break-glass-access` | Sealed emergency account, with alarm | S01-01 Console home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d01-01"></a>D01-01 | Turn module off | Warn which screens disappear and which modules are affected | S01-03 Module settings |
| <a id="d01-02"></a>D01-02 | Apply change set | Confirm, with a summary of changes | S01-08 Change set detail |
| <a id="d01-03"></a>D01-03 | Roll back | Confirm rolling back a change set | S01-08 Change set detail |
| <a id="d01-04"></a>D01-04 | Maintenance mode | Set the message and expected end time | S01-02 Modules list |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
