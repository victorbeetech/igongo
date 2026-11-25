# S48. SOPs & Knowledge Base

[All screens](README.md) · [Module spec](../../modules/48-knowledge-base.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s48-01"></a>S48-01 | Knowledge base | App, Web | `/knowledge-base/knowledge-base` | Articles by department and category | Role home | S48-02 Article, S48-03 Article editor |
| <a id="s48-02"></a>S48-02 | Article | App, Web | `/knowledge-base/article` | Text, photos and videos, with acknowledge | S48-01 Knowledge base, S48-04 Must read | D48-01 Acknowledge article |
| <a id="s48-03"></a>S48-03 | Article editor | Web | `/knowledge-base/article-editor/:id` | Write, version and publish | S48-01 Knowledge base | Back only |
| <a id="s48-04"></a>S48-04 | Must read | App | `/knowledge-base/must-read` | Articles I must acknowledge | Role home | S48-02 Article |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d48-01"></a>D48-01 | Acknowledge article | Confirm I have read it | S48-02 Article |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
