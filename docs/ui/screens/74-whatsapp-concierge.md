# S74. WhatsApp Concierge

[All screens](README.md) · [Module spec](../../modules/74-whatsapp-concierge.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s74-01"></a>S74-01 | WhatsApp inbox | App, Web | `/whatsapp-concierge/whatsapp-inbox` | Shared inbox of guest chats, with assignment | Role home | S74-02 Conversation, S74-04 Bot menu editor |
| <a id="s74-02"></a>S74-02 | Conversation | App, Web | `/whatsapp-concierge/conversation` | Full chat with booking and order shortcuts | S74-01 WhatsApp inbox | D74-01 Take over chat, D74-02 Send payment link |
| <a id="s74-03"></a>S74-03 | Chat with Igongo | App | `/whatsapp-concierge/chat-with-igongo` | The guest's chat with the hotel, answered by the bot first, then staff | Role home | Back only |
| <a id="s74-04"></a>S74-04 | Bot menu editor | Web | `/whatsapp-concierge/bot-menu-editor/:id` | Chat menu, answers and hand-off rules | S74-01 WhatsApp inbox | S74-05 Message templates |
| <a id="s74-05"></a>S74-05 | Message templates | Web | `/whatsapp-concierge/message-templates` | Approved WhatsApp templates | S74-04 Bot menu editor | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d74-01"></a>D74-01 | Take over chat | Agent takes over from the bot | S74-02 Conversation |
| <a id="d74-02"></a>D74-02 | Send payment link | Amount and what it is for | S74-02 Conversation |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
