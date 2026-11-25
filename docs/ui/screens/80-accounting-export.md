# S80. Accounting Export

[All screens](README.md) · [Module spec](../../modules/80-accounting-export.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s80-01"></a>S80-01 | Exports | Web | `/accounting-export/exports` | Accounting exports by period and status | Role home | D80-01 Run export, S80-02 Export mapping |
| <a id="s80-02"></a>S80-02 | Export mapping | Web | `/accounting-export/export-mapping` | Accounts and codes for each item | S80-01 Exports | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d80-01"></a>D80-01 | Run export | Pick period and confirm | S80-01 Exports |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
