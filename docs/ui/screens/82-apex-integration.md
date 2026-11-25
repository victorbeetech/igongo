# S82. APEX Integration

[All screens](README.md) · [Module spec](../../modules/82-apex-integration.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s82-01"></a>S82-01 | APEX status | Web | `/apex-integration/apex-status` | Connection, last sync and errors | Role home | S82-02 Sync log, S82-04 APEX settings |
| <a id="s82-02"></a>S82-02 | Sync log | Web | `/apex-integration/sync-log` | Every sync with errors and retries | S82-01 APEX status | S82-03 Fix sync error |
| <a id="s82-03"></a>S82-03 | Fix sync error | Web | `/apex-integration/fix-sync-error` | Match or correct a record by hand | S82-02 Sync log | D82-01 Retry sync |
| <a id="s82-04"></a>S82-04 | APEX settings | Web | `/apex-integration/apex-settings` | What syncs, direction, frequency and offline rules | S82-01 APEX status | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d82-01"></a>D82-01 | Retry sync | Retry one or all failed items | S82-03 Fix sync error |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
