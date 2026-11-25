# S57. Loyalty & Membership

[All screens](README.md) · [Module spec](../../modules/57-loyalty.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s57-01"></a>S57-01 | My points | App | `/loyalty/my-points` | Points balance, tier and history | Role home, [S54-05 My account](54-crm-guests.md#s54-05) | S57-02 Membership card, S57-03 Rewards catalogue |
| <a id="s57-02"></a>S57-02 | Membership card | App | `/loyalty/membership-card` | Digital membership card with QR | S57-01 My points | Back only |
| <a id="s57-03"></a>S57-03 | Rewards catalogue | App | `/loyalty/rewards-catalogue` | What points can buy | S57-01 My points | D57-01 Redeem points |
| <a id="s57-04"></a>S57-04 | Members | Web | `/loyalty/members` | Members, tiers and points | Role home | S57-05 Loyalty settings |
| <a id="s57-05"></a>S57-05 | Loyalty settings | Web | `/loyalty/loyalty-settings` | Earn and redeem rules, tiers and expiry | S57-04 Members | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d57-01"></a>D57-01 | Redeem points | Confirm the reward and points used | S57-03 Rewards catalogue |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
