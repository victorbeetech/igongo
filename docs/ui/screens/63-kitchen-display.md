# S63. Kitchen Display & Production

[All screens](README.md) · [Module spec](../../modules/63-kitchen-display.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s63-01"></a>S63-01 | Kitchen display | Kiosk | `/kitchen-display/kitchen-display` | Tickets per station, oldest first, with late colours | Role home, [S62-15 Waiter order](62-food-ordering.md#s62-15) | D63-01 Bump ticket, D63-02 Recall ticket, S63-02 Expo screen, S63-05 Kitchen settings |
| <a id="s63-02"></a>S63-02 | Expo screen | Kiosk | `/kitchen-display/expo-screen` | Complete orders waiting at the pass | S63-01 Kitchen display | Back only |
| <a id="s63-03"></a>S63-03 | Production list | App, Web | `/kitchen-display/production-list` | Today's buffet and event production | Role home | Back only |
| <a id="s63-04"></a>S63-04 | Food waste | App, Kiosk | `/kitchen-display/food-waste` | Record waste with reason and quantity | Role home | Back only |
| <a id="s63-05"></a>S63-05 | Kitchen settings | Web | `/kitchen-display/kitchen-settings` | Stations, routing, target times and pre-order timing | S63-01 Kitchen display | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d63-01"></a>D63-01 | Bump ticket | Mark items started or ready | S63-01 Kitchen display |
| <a id="d63-02"></a>D63-02 | Recall ticket | Bring back a bumped ticket | S63-01 Kitchen display |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
