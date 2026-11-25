# S64. Tables & Dine-in

[All screens](README.md) · [Module spec](../../modules/64-tables-dinein.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s64-01"></a>S64-01 | Floor plan | App, Kiosk | `/tables-dinein/floor-plan` | Tables with live status | Role home | D64-01 Seat guests, S64-06 Waiting list, S64-07 Table detail |
| <a id="s64-02"></a>S64-02 | Floor plan editor | Web | `/tables-dinein/floor-plan-editor/:id` | Tables, seats and sections | Role home | Back only |
| <a id="s64-03"></a>S64-03 | Reservations | App, Web | `/tables-dinein/reservations` | Table bookings by time | Role home, S64-04 Book a table | S64-07 Table detail |
| <a id="s64-04"></a>S64-04 | Book a table | App, Public | `/tables-dinein/book-a-table` | Guest picks date, time, people and notes | Role home, [S00-23 Client view home](00-app-shell.md#s00-23) | S64-03 Reservations |
| <a id="s64-05"></a>S64-05 | Table QR menu | Public | `/tables-dinein/table-qr-menu` | Scan the table QR to see the menu, order and pay | [S75-01 Website home](75-public-website.md#s75-01) | D64-02 Call waiter, [S62-04 Cart](62-food-ordering.md#s62-04) |
| <a id="s64-06"></a>S64-06 | Waiting list | App, Kiosk | `/tables-dinein/waiting-list` | Walk-ins waiting, with SMS when ready | S64-01 Floor plan | Back only |
| <a id="s64-07"></a>S64-07 | Table detail | App, Kiosk | `/tables-dinein/table-detail/:id` | Guests, waiter, orders and bill | S64-01 Floor plan, S64-03 Reservations | D64-03 Split bill |
| <a id="s64-08"></a>S64-08 | Open bills | App, Kiosk | `/tables-dinein/open-bills` | Tables and tabs with open bills, bills asked and waiter calls | Role home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d64-01"></a>D64-01 | Seat guests | Pick table and waiter | S64-01 Floor plan |
| <a id="d64-02"></a>D64-02 | Call waiter | Guest asks for a waiter or the bill | S64-05 Table QR menu |
| <a id="d64-03"></a>D64-03 | Split bill | Split by item, seat or amount | S64-07 Table detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
