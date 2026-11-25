# S10. Notifications Engine

[All screens](README.md) · [Module spec](../../modules/10-notifications.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s10-01"></a>S10-01 | Notification rules | Web | `/notifications/notification-rules` | When, who and by which channel | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S10-02 Rule editor, S10-04 Broadcast, S10-05 Delivery log |
| <a id="s10-02"></a>S10-02 | Rule editor | Web | `/notifications/rule-editor/:id` | Event, audience, channels, template, quiet hours and fallback | S10-01 Notification rules | S10-03 Message templates |
| <a id="s10-03"></a>S10-03 | Message templates | Web | `/notifications/message-templates` | Templates per channel and language | S10-02 Rule editor | Back only |
| <a id="s10-04"></a>S10-04 | Broadcast | Web | `/notifications/broadcast` | Send a message to a role, department or client list | S10-01 Notification rules | Back only |
| <a id="s10-05"></a>S10-05 | Delivery log | Web | `/notifications/delivery-log` | Sent, delivered, read and failed, with cost | S10-01 Notification rules | S10-06 Channel spend |
| <a id="s10-06"></a>S10-06 | Channel spend | Web | `/notifications/channel-spend` | SMS and WhatsApp spend against limits | S10-05 Delivery log | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
