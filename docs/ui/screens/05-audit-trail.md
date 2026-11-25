# S05. Audit Trail

[All screens](README.md) · [Module spec](../../modules/05-audit-trail.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s05-01"></a>S05-01 | Audit search | Web | `/audit-trail/audit-search` | Search by person, module, record, action, date or value | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S05-02 Audit entry, S05-04 Audit alerts, S05-06 Export audit |
| <a id="s05-02"></a>S05-02 | Audit entry | Web | `/audit-trail/audit-entry` | One action with old and new values, device and location | S05-01 Audit search | D05-01 Undo change |
| <a id="s05-03"></a>S05-03 | Record timeline | App, Web | `/audit-trail/record-timeline` | The full life of one record | [S00-27 Everything about](00-app-shell.md#s00-27), [S04-02 Account detail](04-users-login.md#s04-02), [S54-02 Guest profile](54-crm-guests.md#s54-02) | Back only |
| <a id="s05-04"></a>S05-04 | Audit alerts | Web | `/audit-trail/audit-alerts` | Suspicious patterns raised by the system | Role home, S05-01 Audit search | S05-05 Alert rules |
| <a id="s05-05"></a>S05-05 | Alert rules | Web | `/audit-trail/alert-rules` | What raises an alert and who is told | S05-04 Audit alerts | Back only |
| <a id="s05-06"></a>S05-06 | Export audit | Web | `/audit-trail/export-audit` | Export a filtered audit list | S05-01 Audit search | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d05-01"></a>D05-01 | Undo change | Confirm undoing a change, which is itself logged | S05-02 Audit entry |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
