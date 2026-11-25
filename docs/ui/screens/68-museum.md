# S68. Museum & Cultural Visits

[All screens](README.md) · [Module spec](../../modules/68-museum.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s68-01"></a>S68-01 | Museum home | App, Public | `/museum/museum-home` | Visits, tours, experiences and opening hours | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | S68-02 Buy tickets, S68-03 Book a tour, S68-04 Group booking, S68-07 Audio guide, S68-09 Experiences, S68-12 Museum settings |
| <a id="s68-02"></a>S68-02 | Buy tickets | App, Public | `/museum/buy-tickets` | Ticket types, date and time slot | S68-01 Museum home | D68-01 Slot full, [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s68-03"></a>S68-03 | Book a tour | App, Public | `/museum/book-a-tour` | Tour, language, date and group size | S68-01 Museum home | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s68-04"></a>S68-04 | Group booking | App, Public | `/museum/group-booking` | School and group booking with list and deposit | S68-01 Museum home | Back only |
| <a id="s68-05"></a>S68-05 | My tickets | App | `/museum/my-tickets` | QR tickets | [S77-01 Pay](77-payments.md#s77-01) | Back only |
| <a id="s68-06"></a>S68-06 | Ticket scanner | App, Kiosk | `/museum/ticket-scanner` | Scan tickets at the entrance | Role home | Back only |
| <a id="s68-07"></a>S68-07 | Audio guide | App, Public | `/museum/audio-guide` | Exhibit content by QR, in the chosen language | S68-01 Museum home | Back only |
| <a id="s68-08"></a>S68-08 | Exhibit content | Web | `/museum/exhibit-content` | Exhibits, text, audio and QR codes | Role home, S68-10 Museum bookings | Back only |
| <a id="s68-09"></a>S68-09 | Experiences | App, Public | `/museum/experiences` | Cooking, dance and craft experiences to book | S68-01 Museum home | Back only |
| <a id="s68-10"></a>S68-10 | Museum bookings | App, Web | `/museum/museum-bookings` | Visits, tours and groups by day | Role home | S68-08 Exhibit content |
| <a id="s68-11"></a>S68-11 | My performances | App | `/museum/my-performances` | A performer's shows and experiences today and this week | Role home | Back only |
| <a id="s68-12"></a>S68-12 | Museum settings | Web | `/museum/museum-settings` | Ticket types, slots and capacity; Group booking rules; Exhibit content and languages | S68-01 Museum home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d68-01"></a>D68-01 | Slot full | Suggest the next free slot | S68-02 Buy tickets |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
