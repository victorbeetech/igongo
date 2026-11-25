# S67. Room Bookings

[All screens](README.md) · [Module spec](../../modules/67-room-bookings.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s67-01"></a>S67-01 | Rooms | App, Public | `/room-bookings/rooms` | Room types with photos, amenities and prices | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23), [S55-04 Company portal](55-corporate-accounts.md#s55-04) | S67-02 Room type detail, S67-14 Booking settings |
| <a id="s67-02"></a>S67-02 | Room type detail | App, Public | `/room-bookings/room-type-detail/:id` | Photos, amenities, capacity and availability | S67-01 Rooms | S67-03 Pick dates |
| <a id="s67-03"></a>S67-03 | Pick dates | App, Public | `/room-bookings/pick-dates` | Check-in, check-out, guests and availability from APEX | S67-02 Room type detail, [S75-03 Website booking](75-public-website.md#s75-03) | D67-03 APEX offline, S67-04 Booking summary |
| <a id="s67-04"></a>S67-04 | Booking summary | App, Public | `/room-bookings/booking-summary` | Room, dates, extras, packages and total | S67-03 Pick dates | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s67-05"></a>S67-05 | Booking confirmed | App, Public | `/room-bookings/booking-confirmed` | Confirmation with booking number | [S77-01 Pay](77-payments.md#s77-01) | S67-08 Pre-arrival, S67-09 Digital check-in |
| <a id="s67-06"></a>S67-06 | My bookings | App | `/room-bookings/my-bookings` | Upcoming and past stays | Role home, [S54-05 My account](54-crm-guests.md#s54-05) | S67-07 Booking detail |
| <a id="s67-07"></a>S67-07 | Booking detail | App, Web | `/room-bookings/booking-detail/:id` | One booking with payments and requests | S67-06 My bookings, S67-10 Front desk bookings, S67-11 Arrivals and departures | D67-01 Change booking, D67-02 Cancel booking, [S56-03 Give feedback](56-guest-feedback.md#s56-03) |
| <a id="s67-08"></a>S67-08 | Pre-arrival | App | `/room-bookings/pre-arrival` | Arrival time, requests, pickup and pre-ordered food | S67-05 Booking confirmed | Back only |
| <a id="s67-09"></a>S67-09 | Digital check-in | App, Public | `/room-bookings/digital-check-in` | Check-in form sent to the front desk | S67-05 Booking confirmed | Back only |
| <a id="s67-10"></a>S67-10 | Front desk bookings | App, Web | `/room-bookings/front-desk-bookings` | Bookings from the app, with APEX sync status | Role home | S67-07 Booking detail, S67-13 Packages |
| <a id="s67-11"></a>S67-11 | Arrivals and departures | App, Web | `/room-bookings/arrivals-and-departures` | Today's arrivals and departures from APEX, with requests and pre-orders | Role home | S67-07 Booking detail |
| <a id="s67-12"></a>S67-12 | In-house guests | App, Web | `/room-bookings/in-house-guests` | Guests staying now, with VIPs, birthdays and requests flagged | Role home | [S54-02 Guest profile](54-crm-guests.md#s54-02) |
| <a id="s67-13"></a>S67-13 | Packages | Web | `/room-bookings/packages` | Room and experience packages | S67-10 Front desk bookings | Back only |
| <a id="s67-14"></a>S67-14 | Booking settings | Web | `/room-bookings/booking-settings` | Which room types are sold in the app; Deposit and cancellation policies; Packages; What to do when APEX is offline (stop sales, or take requests to confirm... | S67-01 Rooms | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d67-01"></a>D67-01 | Change booking | New dates within the policy | S67-07 Booking detail |
| <a id="d67-02"></a>D67-02 | Cancel booking | Show the policy and refund | S67-07 Booking detail |
| <a id="d67-03"></a>D67-03 | APEX offline | Booking taken as a request to confirm | S67-03 Pick dates |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
