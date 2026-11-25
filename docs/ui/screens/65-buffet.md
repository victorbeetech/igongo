# S65. Buffet Service

[All screens](README.md) · [Module spec](../../modules/65-buffet.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s65-01"></a>S65-01 | Buffet sessions | App, Web | `/buffet/buffet-sessions` | Sessions with menu, capacity and headcount | Role home | S65-03 Buffet live, S65-05 Buffet settings |
| <a id="s65-02"></a>S65-02 | Buffet entry | App, Kiosk | `/buffet/buffet-entry` | Scan ticket, band or staff card, or take payment at the door | Role home | D65-01 Entry refused |
| <a id="s65-03"></a>S65-03 | Buffet live | App, Web | `/buffet/buffet-live` | Headcount now and at close | S65-01 Buffet sessions | Back only |
| <a id="s65-04"></a>S65-04 | Buy buffet ticket | App, Public | `/buffet/buy-buffet-ticket` | Guest buys a buffet ticket | [S00-23 Client view home](00-app-shell.md#s00-23) | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s65-05"></a>S65-05 | Buffet settings | Web | `/buffet/buffet-settings` | Buffet sessions and who can enter; Whether re-entry is allowed | S65-01 Buffet sessions | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d65-01"></a>D65-01 | Entry refused | Already entered, full or not valid | S65-02 Buffet entry |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
