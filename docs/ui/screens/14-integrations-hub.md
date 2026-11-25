# S14. Integrations Hub & Webhooks

[All screens](README.md) · [Module spec](../../modules/14-integrations-hub.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s14-01"></a>S14-01 | Integrations | Web | `/integrations-hub/integrations` | Every connection with status | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S14-02 Connection settings, S14-03 Webhooks, S14-04 API keys |
| <a id="s14-02"></a>S14-02 | Connection settings | Web | `/integrations-hub/connection-settings` | Keys and options for one provider, with a test button | S14-01 Integrations | Back only |
| <a id="s14-03"></a>S14-03 | Webhooks | Web | `/integrations-hub/webhooks` | Outgoing webhooks with delivery log | S14-01 Integrations | Back only |
| <a id="s14-04"></a>S14-04 | API keys | Web | `/integrations-hub/api-keys` | Partner keys with limits and expiry | S14-01 Integrations | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
