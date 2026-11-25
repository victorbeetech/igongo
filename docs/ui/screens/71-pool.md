# S71. Swimming Pool

[All screens](README.md) · [Module spec](../../modules/71-pool.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s71-01"></a>S71-01 | Pool home | App, Public | `/pool/pool-home` | Opening hours, passes and today's status | Role home, [S00-04 Explore as guest home](00-app-shell.md#s00-04), [S00-23 Client view home](00-app-shell.md#s00-23) | D71-01 Pool closed, S71-02 Buy pool pass, S71-07 Swimming lessons, S71-08 Pool settings |
| <a id="s71-02"></a>S71-02 | Buy pool pass | App, Public | `/pool/buy-pool-pass` | Day, session or family pass | S71-01 Pool home | [S77-01 Pay](77-payments.md#s77-01) |
| <a id="s71-03"></a>S71-03 | Pool entry | App, Kiosk | `/pool/pool-entry` | Scan pass, band, membership or room guest | Role home | D71-02 Pool full |
| <a id="s71-04"></a>S71-04 | Pool live | App, Web | `/pool/pool-live` | Count inside against capacity | Role home | S71-06 Lifeguard log |
| <a id="s71-05"></a>S71-05 | Water tests | App, Kiosk | `/pool/water-tests` | Chlorine and pH readings with times | Role home | Back only |
| <a id="s71-06"></a>S71-06 | Lifeguard log | App, Kiosk | `/pool/lifeguard-log` | Duty and incidents | Role home, S71-04 Pool live | Back only |
| <a id="s71-07"></a>S71-07 | Swimming lessons | App, Public | `/pool/swimming-lessons` | Book lessons | S71-01 Pool home | Back only |
| <a id="s71-08"></a>S71-08 | Pool settings | Web | `/pool/pool-settings` | Pass types and opening hours; Capacity limits; Water test schedule | S71-01 Pool home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d71-01"></a>D71-01 | Pool closed | Notice with reason and reopening time | S71-01 Pool home |
| <a id="d71-02"></a>D71-02 | Pool full | Wait or come back later | S71-03 Pool entry |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
