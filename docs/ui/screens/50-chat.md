# S50. Chat

[All screens](README.md) · [Module spec](../../modules/50-chat.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s50-01"></a>S50-01 | Chats | App | `/chat/chats` | Direct and group chats, unread first | Role home | S50-02 Chat room, S50-03 New chat, S50-05 Chat settings |
| <a id="s50-02"></a>S50-02 | Chat room | App | `/chat/chat-room/:id` | Messages, photos, voice notes, files and read receipts | S50-01 Chats, S50-03 New chat | D50-01 Delete message, D50-02 Report message, S50-04 Group info |
| <a id="s50-03"></a>S50-03 | New chat | App | `/chat/new-chat` | Pick people or a group | S50-01 Chats | S50-02 Chat room |
| <a id="s50-04"></a>S50-04 | Group info | App | `/chat/group-info` | Members, media and settings | S50-02 Chat room | Back only |
| <a id="s50-05"></a>S50-05 | Chat settings | Web | `/chat/chat-settings` | Who can chat with whom, groups allowed and message retention | S50-01 Chats | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d50-01"></a>D50-01 | Delete message | Delete for me or for everyone | S50-02 Chat room |
| <a id="d50-02"></a>D50-02 | Report message | Flag a message to HR | S50-02 Chat room |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
