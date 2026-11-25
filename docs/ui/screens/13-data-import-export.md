# S13. Data Import, Export & Backup

[All screens](README.md) · [Module spec](../../modules/13-data-import-export.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s13-01"></a>S13-01 | Import wizard | Web | `/data-import-export/import-wizard` | Upload, map columns, dry run, then import | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S13-02 Import history, S13-04 Backups |
| <a id="s13-02"></a>S13-02 | Import history | Web | `/data-import-export/import-history` | Past imports with errors and results | S13-01 Import wizard | Back only |
| <a id="s13-03"></a>S13-03 | Exports | App, Web | `/data-import-export/exports` | My exports and scheduled exports | Role home | Back only |
| <a id="s13-04"></a>S13-04 | Backups | Web | `/data-import-export/backups` | Backup status and restore points | Role home, S13-01 Import wizard | S13-05 Restore record |
| <a id="s13-05"></a>S13-05 | Restore record | Web | `/data-import-export/restore-record` | Restore a single deleted record | S13-04 Backups | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
