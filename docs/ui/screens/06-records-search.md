# S06. Records Archive & Search

[All screens](README.md) · [Module spec](../../modules/06-records-search.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s06-01"></a>S06-01 | Archive policies | Web | `/records-search/archive-policies` | When records are archived, per module | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S06-02 Legal holds |
| <a id="s06-02"></a>S06-02 | Legal holds | Web | `/records-search/legal-holds` | Records frozen from archiving or deletion | S06-01 Archive policies | D06-01 Place legal hold |
| <a id="s06-03"></a>S06-03 | Saved searches | App, Web | `/records-search/saved-searches` | Saved searches with alerts | Role home | [S00-26 Search results](00-app-shell.md#s00-26) |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d06-01"></a>D06-01 | Place legal hold | Reason and scope | S06-02 Legal holds |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
