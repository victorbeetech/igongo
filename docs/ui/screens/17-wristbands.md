# S17. Event Wristbands

[All screens](README.md) · [Module spec](../../modules/17-wristbands.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s17-01"></a>S17-01 | Wristbands home | Web | `/wristbands/wristbands-home` | Bands in store, assigned, in use, lost and damaged | Role home | S17-02 Band stock, S17-04 Band types, S17-05 Event bands, S17-09 Missing bands, S17-10 Scan log |
| <a id="s17-02"></a>S17-02 | Band stock | Web | `/wristbands/band-stock` | Every band with number, chip, colour, type and status | S17-01 Wristbands home | S17-03 Register bands, S17-08 Band detail |
| <a id="s17-03"></a>S17-03 | Register bands | App, Web | `/wristbands/register-bands` | Register bands in bulk by scanning or spreadsheet | S17-02 Band stock | Back only |
| <a id="s17-04"></a>S17-04 | Band types | Web | `/wristbands/band-types` | Colours, types, sizes, chips and default entitlements | S17-01 Wristbands home | S17-12 Band designs |
| <a id="s17-05"></a>S17-05 | Event bands | App, Web | `/wristbands/event-bands` | Ranges assigned to one event, with access per range | S17-01 Wristbands home, [S69-05 Event detail](69-events-conferences.md#s69-05) | D17-01 Reset range, D17-02 Reassign range, D17-04 Top up entitlements, S17-06 Assign range, S17-11 Event band summary |
| <a id="s17-06"></a>S17-06 | Assign range | App, Web | `/wristbands/assign-range` | Pick a range such as 1-200, preview conflicts, set access | S17-05 Event bands | D17-05 Range conflict |
| <a id="s17-07"></a>S17-07 | Band scanner | App, Kiosk | `/wristbands/band-scanner` | Scan at the gate or food line: allowed or refused, with entitlements left | Role home | S17-08 Band detail |
| <a id="s17-08"></a>S17-08 | Band detail | App, Web | `/wristbands/band-detail/:id` | One band: event, attendee, entitlements and scan history | S17-02 Band stock, S17-07 Band scanner | D17-03 Block band |
| <a id="s17-09"></a>S17-09 | Missing bands | Web | `/wristbands/missing-bands` | Assigned but not returned after an event, with charges | S17-01 Wristbands home | Back only |
| <a id="s17-10"></a>S17-10 | Scan log | Web | `/wristbands/scan-log` | Every scan with place, time, device and result | Role home, S17-01 Wristbands home | Back only |
| <a id="s17-11"></a>S17-11 | Event band summary | Web | `/wristbands/event-band-summary` | Bands used, meals served and peak entry times | S17-05 Event bands | Back only |
| <a id="s17-12"></a>S17-12 | Band designs | Web | `/wristbands/band-designs` | Wristband designs in the card designer | S17-04 Band types | [S16-03 Card designer](16-staff-cards.md#s16-03) |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d17-01"></a>D17-01 | Reset range | Confirm resetting a range and returning bands to store | S17-05 Event bands |
| <a id="d17-02"></a>D17-02 | Reassign range | Move a range straight to another event | S17-05 Event bands |
| <a id="d17-03"></a>D17-03 | Block band | Mark a band lost and block it | S17-08 Band detail |
| <a id="d17-04"></a>D17-04 | Top up entitlements | Add meals, drinks or entries to a band or range | S17-05 Event bands |
| <a id="d17-05"></a>D17-05 | Range conflict | Bands in the range already in use, lost or damaged | S17-06 Assign range |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
