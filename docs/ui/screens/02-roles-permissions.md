# S02. Roles & Permissions

[All screens](README.md) · [Module spec](../../modules/02-roles-permissions.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s02-01"></a>S02-01 | Roles list | Web | `/roles-permissions/roles-list` | Every role with its holders count and department | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | D02-01 Clone role, D02-02 Delete or archive role, S02-02 Role builder, S02-08 Temporary roles, S02-09 Compare roles, S02-10 View as role, S02-11 Permission report, S02-13 Separation of duties |
| <a id="s02-02"></a>S02-02 | Role builder | Web | `/roles-permissions/role-builder` | Name, colour, icon, description and department of a role | D02-01 Clone role, Role home, S02-01 Roles list | S02-03 Permissions matrix, S02-05 Approval limits, S02-06 Role conditions, S02-07 Role holders |
| <a id="s02-03"></a>S02-03 | Permissions matrix | Web | `/roles-permissions/permissions-matrix` | Actions per feature per module, with data scope | S02-02 Role builder | S02-04 Field permissions |
| <a id="s02-04"></a>S02-04 | Field permissions | Web | `/roles-permissions/field-permissions` | Hide or lock single fields for a role | S02-03 Permissions matrix | Back only |
| <a id="s02-05"></a>S02-05 | Approval limits | Web | `/roles-permissions/approval-limits` | Tiers per request type for a role | S02-02 Role builder | S02-12 Approval tier amounts |
| <a id="s02-06"></a>S02-06 | Role conditions | Web | `/roles-permissions/role-conditions` | Time windows, devices, locations and 2FA rules | S02-02 Role builder | Back only |
| <a id="s02-07"></a>S02-07 | Role holders | Web | `/roles-permissions/role-holders` | People who hold a role, with add and remove | Role home, S02-02 Role builder | D02-03 Assign role |
| <a id="s02-08"></a>S02-08 | Temporary roles | Web | `/roles-permissions/temporary-roles` | Acting roles with start and end dates | S02-01 Roles list | D02-03 Assign role |
| <a id="s02-09"></a>S02-09 | Compare roles | Web | `/roles-permissions/compare-roles` | Two roles side by side | S02-01 Roles list | Back only |
| <a id="s02-10"></a>S02-10 | View as role | App, Web | `/roles-permissions/view-as-role` | Preview the app exactly as a role or person sees it | S02-01 Roles list | [S03-08 Layout preview](03-app-builder.md#s03-08) |
| <a id="s02-11"></a>S02-11 | Permission report | Web | `/roles-permissions/permission-report` | Who can do an action, and which role gave it | S02-01 Roles list | Back only |
| <a id="s02-12"></a>S02-12 | Approval tier amounts | Web | `/roles-permissions/approval-tier-amounts` | The amounts behind Tier 1, 2 and 3 | S02-05 Approval limits | Back only |
| <a id="s02-13"></a>S02-13 | Separation of duties | Web | `/roles-permissions/separation-of-duties` | Rules such as maker and checker must differ | S02-01 Roles list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d02-01"></a>D02-01 | Clone role | Name the copy | S02-01 Roles list |
| <a id="d02-02"></a>D02-02 | Delete or archive role | Warn about holders and offer a replacement role | S02-01 Roles list |
| <a id="d02-03"></a>D02-03 | Assign role | Pick people and dates | S02-07 Role holders, S02-08 Temporary roles |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
