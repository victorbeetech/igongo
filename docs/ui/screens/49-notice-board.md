# S49. Notice Board

[All screens](README.md) · [Module spec](../../modules/49-notice-board.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s49-01"></a>S49-01 | Notice board | App | `/notice-board/notice-board` | Posts and announcements, pinned first | Role home | S49-02 Post detail, S49-03 New post, S49-05 Board settings |
| <a id="s49-02"></a>S49-02 | Post detail | App | `/notice-board/post-detail/:id` | One post with comments, likes and who has read it | S49-01 Notice board | D49-01 Acknowledge post, D49-02 Delete post, D49-03 Report post, S49-04 Read receipts |
| <a id="s49-03"></a>S49-03 | New post | App, Web | `/notice-board/new-post` | Text, photos, files, audience and schedule | S49-01 Notice board | Back only |
| <a id="s49-04"></a>S49-04 | Read receipts | App, Web | `/notice-board/read-receipts` | Who has read and acknowledged a post | S49-02 Post detail | Back only |
| <a id="s49-05"></a>S49-05 | Board settings | Web | `/notice-board/board-settings` | Who can post, comment and like, per role and board | S49-01 Notice board | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d49-01"></a>D49-01 | Acknowledge post | Confirm I have read it | S49-02 Post detail |
| <a id="d49-02"></a>D49-02 | Delete post | Confirm, with a reason | S49-02 Post detail |
| <a id="d49-03"></a>D49-03 | Report post | Flag a post or comment | S49-02 Post detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
