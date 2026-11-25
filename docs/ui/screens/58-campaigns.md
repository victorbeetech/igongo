# S58. Marketing Campaigns

[All screens](README.md) · [Module spec](../../modules/58-campaigns.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s58-01"></a>S58-01 | Campaigns | Web | `/campaigns/campaigns` | Campaigns by status and channel | Role home | S58-02 Campaign editor |
| <a id="s58-02"></a>S58-02 | Campaign editor | Web | `/campaigns/campaign-editor/:id` | Audience, message, channel, schedule and offer | S58-01 Campaigns | D58-01 Send campaign, D58-02 Test send |
| <a id="s58-03"></a>S58-03 | Campaign results | Web | `/campaigns/campaign-results` | Sent, opened, clicked and bookings made | D58-01 Send campaign, Role home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d58-01"></a>D58-01 | Send campaign | Confirm audience size and cost | S58-02 Campaign editor |
| <a id="d58-02"></a>D58-02 | Test send | Send to myself first | S58-02 Campaign editor |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
