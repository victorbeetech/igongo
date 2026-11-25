# S62. Food Ordering

[All screens](README.md) · [Module spec](../../modules/62-food-ordering.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s62-01"></a>S62-01 | Food home | App, Public | `/food-ordering/food-home` | Outlets, menus and offers for the guest | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | S62-02 Outlet menu, S62-16 Ordering settings |
| <a id="s62-02"></a>S62-02 | Outlet menu | App, Public | `/food-ordering/outlet-menu` | Items by section with photos and prices | S62-01 Food home | S62-03 Item detail |
| <a id="s62-03"></a>S62-03 | Item detail | App, Public | `/food-ordering/item-detail/:id` | Options, portion, extras, notes and allergies | S62-02 Outlet menu | S62-04 Cart |
| <a id="s62-04"></a>S62-04 | Cart | App, Public | `/food-ordering/cart` | Items, notes, order type and ready time estimate | S62-03 Item detail, [S64-05 Table QR menu](64-tables-dinein.md#s64-05) | D62-01 Edit cart item, S62-05 Order type |
| <a id="s62-05"></a>S62-05 | Order type | App, Public | `/food-ordering/order-type` | Delivery, room service, dine-in, takeaway or pre-order | S62-04 Cart | S62-06 Pre-order arrival time, S62-07 Delivery address, S62-08 Checkout |
| <a id="s62-06"></a>S62-06 | Pre-order arrival time | App, Public | `/food-ordering/pre-order-arrival-time` | Pick arrival time and what is paid now | S62-05 Order type | S62-08 Checkout |
| <a id="s62-07"></a>S62-07 | Delivery address | App, Public | `/food-ordering/delivery-address` | Address or a spot on the grounds, on a map | S62-05 Order type | S62-08 Checkout |
| <a id="s62-08"></a>S62-08 | Checkout | App, Public | `/food-ordering/checkout` | Payment choice, deposit, charge to room or corporate account | S62-05 Order type, S62-06 Pre-order arrival time, S62-07 Delivery address | D62-04 Kitchen busy, [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s62-09"></a>S62-09 | Order placed | App, Public | `/food-ordering/order-placed` | Confirmation with order number and ready time | [S77-03 Payment result](77-payments.md#s77-03) | S62-10 Track order |
| <a id="s62-10"></a>S62-10 | Track order | App, Public | `/food-ordering/track-order` | Received, preparing, ready, on the way, delivered | S62-09 Order placed, S62-11 My orders | D62-02 Cancel order, [S56-03 Give feedback](56-guest-feedback.md#s56-03), [S66-10 Live rider map](66-delivery-riders.md#s66-10) |
| <a id="s62-11"></a>S62-11 | My orders | App | `/food-ordering/my-orders` | Past and current orders, with reorder | Role home, [S54-05 My account](54-crm-guests.md#s54-05) | S62-10 Track order |
| <a id="s62-12"></a>S62-12 | Orders board | App, Web | `/food-ordering/orders-board` | Staff view of all orders by status, type and outlet | Role home | S62-13 Order detail |
| <a id="s62-13"></a>S62-13 | Order detail | App, Web | `/food-ordering/order-detail/:id` | Items, payments, timeline and notes | S62-12 Orders board, S62-14 Take order | D62-03 Void item |
| <a id="s62-14"></a>S62-14 | Take order | App, Kiosk | `/food-ordering/take-order` | Staff enters a phone or walk-in order | Role home | S62-13 Order detail |
| <a id="s62-15"></a>S62-15 | Waiter order | App | `/food-ordering/waiter-order` | Waiter orders for a table from the phone | Role home | [S63-01 Kitchen display](63-kitchen-display.md#s63-01) |
| <a id="s62-16"></a>S62-16 | Ordering settings | Web | `/food-ordering/ordering-settings` | Order types on or off per outlet; Minimum notice for pre-orders, and the deposit rule; Cancel and change windows; Which payment options each order type... | S62-01 Food home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d62-01"></a>D62-01 | Edit cart item | Change options or quantity | S62-04 Cart |
| <a id="d62-02"></a>D62-02 | Cancel order | Reason, and refund rules shown | S62-10 Track order |
| <a id="d62-03"></a>D62-03 | Void item | Staff voids an item with reason and approval | S62-13 Order detail |
| <a id="d62-04"></a>D62-04 | Kitchen busy | Show a later ready time before paying | S62-08 Checkout |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
