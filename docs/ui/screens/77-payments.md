# S77. Payments

[All screens](README.md) · [Module spec](../../modules/77-payments.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s77-01"></a>S77-01 | Pay | App, Public | `/payments/pay` | Choose MoMo, Airtel, card or other methods switched on | [S59-04 Buy gift card](59-promotions-vouchers.md#s59-04), [S62-08 Checkout](62-food-ordering.md#s62-08), [S65-04 Buy buffet ticket](65-buffet.md#s65-04), [S67-04 Booking summary](67-room-bookings.md#s67-04), [S68-02 Buy tickets](68-museum.md#s68-02), [S68-03 Book a tour](68-museum.md#s68-03), [S71-02 Buy pool pass](71-pool.md#s71-02), [S72-04 Health questions](72-spa.md#s72-04), [S73-03 Shop cart](73-crafts-bookshop.md#s73-03) | D77-02 Payment failed, S77-02 Mobile money prompt, [S67-05 Booking confirmed](67-room-bookings.md#s67-05), [S68-05 My tickets](68-museum.md#s68-05) |
| <a id="s77-02"></a>S77-02 | Mobile money prompt | App, Public | `/payments/mobile-money-prompt` | Waiting for the payer to confirm on their phone | S77-01 Pay | S77-03 Payment result |
| <a id="s77-03"></a>S77-03 | Payment result | App, Public | `/payments/payment-result/:id` | Paid, failed or pending, with next steps | S77-02 Mobile money prompt | [S62-09 Order placed](62-food-ordering.md#s62-09) |
| <a id="s77-04"></a>S77-04 | Payments list | Web | `/payments/payments-list` | Every payment with method, status and link | Role home | S77-05 Payment detail, S77-06 Payment methods, S77-07 Settlements |
| <a id="s77-05"></a>S77-05 | Payment detail | Web | `/payments/payment-detail/:id` | One payment with provider reference and refunds | S77-04 Payments list | D77-01 Refund |
| <a id="s77-06"></a>S77-06 | Payment methods | Web | `/payments/payment-methods` | Every method with its on and off switch, per outlet and module | S77-04 Payments list | Back only |
| <a id="s77-07"></a>S77-07 | Settlements | Web | `/payments/settlements` | Provider settlements and differences | Role home, S77-04 Payments list | Back only |
| <a id="s77-08"></a>S77-08 | Record cash payment | App, Kiosk | `/payments/record-cash-payment` | Staff records cash or bank transfer | S77-10 Till | [S78-02 Document view](78-receipts-invoicing.md#s78-02) |
| <a id="s77-09"></a>S77-09 | Payment link | App, Web | `/payments/payment-link` | Create and send a payment link by WhatsApp, SMS or email | Role home, [D74-02 Send payment link](74-whatsapp-concierge.md#d74-02) | Back only |
| <a id="s77-10"></a>S77-10 | Till | App, Kiosk | `/payments/till` | Take payment for a bill, order or walk-in sale | Role home, [S79-04 Open till](79-cash-up.md#s79-04) | S77-08 Record cash payment, [S79-01 Cash-up](79-cash-up.md#s79-01) |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d77-01"></a>D77-01 | Refund | Full or part, with approval | S77-05 Payment detail |
| <a id="d77-02"></a>D77-02 | Payment failed | Try again or choose another method | S77-01 Pay |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
