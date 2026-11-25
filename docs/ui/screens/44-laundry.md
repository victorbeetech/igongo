# S44. Laundry

[All screens](README.md) · [Module spec](../../modules/44-laundry.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s44-01"></a>S44-01 | Laundry orders | App, Web | `/laundry/laundry-orders` | Guest laundry orders and status | Role home | D44-01 Laundry ready, S44-03 Linen stock, S44-04 Uniforms, S44-05 Laundry settings |
| <a id="s44-02"></a>S44-02 | Guest laundry request | App | `/laundry/guest-laundry-request` | Guest asks for pickup with items | Role home | [S60-02 My requests](60-guest-requests.md#s60-02) |
| <a id="s44-03"></a>S44-03 | Linen stock | App, Web | `/laundry/linen-stock` | Linen in rooms, in laundry and in store | Role home, S44-01 Laundry orders | Back only |
| <a id="s44-04"></a>S44-04 | Uniforms | App, Web | `/laundry/uniforms` | Uniforms issued, returned and due | Role home, S44-01 Laundry orders | Back only |
| <a id="s44-05"></a>S44-05 | Laundry settings | Web | `/laundry/laundry-settings` | Item list and turnaround times; Whether guests can order laundry in the app | S44-01 Laundry orders | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d44-01"></a>D44-01 | Laundry ready | Notify the guest or department | S44-01 Laundry orders |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
