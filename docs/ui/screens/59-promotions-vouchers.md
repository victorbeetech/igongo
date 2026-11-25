# S59. Promotions, Vouchers & Gift Cards

[All screens](README.md) · [Module spec](../../modules/59-promotions-vouchers.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s59-01"></a>S59-01 | Promotions | Web | `/promotions-vouchers/promotions` | Promo codes, offers and happy hours | Role home | S59-02 Promotion editor, S59-03 Vouchers |
| <a id="s59-02"></a>S59-02 | Promotion editor | Web | `/promotions-vouchers/promotion-editor/:id` | Rules, dates, outlets, items and limits | S59-01 Promotions | Back only |
| <a id="s59-03"></a>S59-03 | Vouchers | App, Web | `/promotions-vouchers/vouchers` | Vouchers issued and redeemed | S59-01 Promotions | Back only |
| <a id="s59-04"></a>S59-04 | Buy gift card | App, Public | `/promotions-vouchers/buy-gift-card` | Guest buys a gift card for someone | [S00-23 Client view home](00-app-shell.md#s00-23) | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s59-05"></a>S59-05 | My vouchers | App | `/promotions-vouchers/my-vouchers` | Gift cards and vouchers with QR and balance | Role home, [S54-05 My account](54-crm-guests.md#s54-05) | Back only |
| <a id="s59-06"></a>S59-06 | Redeem voucher | App, Kiosk | `/promotions-vouchers/redeem-voucher` | Scan a voucher at a till | Role home | D59-01 Invalid code |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d59-01"></a>D59-01 | Invalid code | Expired, used up or not valid here | S59-06 Redeem voucher |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
