# S69. Events & Conferences

[All screens](README.md) · [Module spec](../../modules/69-events-conferences.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s69-01"></a>S69-01 | Events home | App, Public | `/events-conferences/events-home` | Event types, venues and packages | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | S69-02 Event enquiry |
| <a id="s69-02"></a>S69-02 | Event enquiry | App, Public | `/events-conferences/event-enquiry` | Date, type, guests and needs | Role home, S69-01 Events home | [D75-01 Enquiry sent](75-public-website.md#d75-01) |
| <a id="s69-03"></a>S69-03 | Enquiries | App, Web | `/events-conferences/enquiries` | New enquiries to answer | Role home | S69-04 Event pipeline |
| <a id="s69-04"></a>S69-04 | Event pipeline | Web | `/events-conferences/event-pipeline` | Enquiry, site visit, quote, confirmed, in progress, completed | Role home, S69-03 Enquiries | S69-05 Event detail |
| <a id="s69-05"></a>S69-05 | Event detail | App, Web | `/events-conferences/event-detail/:id` | Client, package, payments, run sheet, guests and bands | S69-04 Event pipeline | S69-06 Quote builder, S69-08 Run sheet, S69-09 Guest list, S69-11 Post-event report, [S17-05 Event bands](17-wristbands.md#s17-05) |
| <a id="s69-06"></a>S69-06 | Quote builder | Web | `/events-conferences/quote-builder` | Venue, food, decor, equipment and bands | S69-05 Event detail | D69-01 Send quote |
| <a id="s69-07"></a>S69-07 | Contract | App, Web, Public | `/events-conferences/contract` | Contract with e-signature | D69-01 Send quote, S69-12 My event | D69-02 Confirm event |
| <a id="s69-08"></a>S69-08 | Run sheet | App, Web | `/events-conferences/run-sheet` | Timeline and tasks per department | Role home, S69-05 Event detail | Back only |
| <a id="s69-09"></a>S69-09 | Guest list | App, Web | `/events-conferences/guest-list` | Invites, RSVPs and QR check-in | Role home, S69-05 Event detail | S69-10 Event check-in |
| <a id="s69-10"></a>S69-10 | Event check-in | App, Kiosk | `/events-conferences/event-check-in` | Scan QR invites at the door | Role home, S69-09 Guest list | Back only |
| <a id="s69-11"></a>S69-11 | Post-event report | App, Web | `/events-conferences/post-event-report` | Numbers, feedback and costs | S69-05 Event detail | Back only |
| <a id="s69-12"></a>S69-12 | My event | App | `/events-conferences/my-event` | The client's view of their event | Role home | S69-07 Contract |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d69-01"></a>D69-01 | Send quote | Preview and send | S69-06 Quote builder |
| <a id="d69-02"></a>D69-02 | Confirm event | Deposit received and event confirmed | S69-07 Contract |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
