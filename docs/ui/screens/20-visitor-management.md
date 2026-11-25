# S20. Visitors & Contractors

[All screens](README.md) · [Module spec](../../modules/20-visitor-management.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s20-01"></a>S20-01 | Visitors today | App, Web | `/visitor-management/visitors-today` | Expected, inside and left, with overstays highlighted | Role home | S20-02 Pre-register visitor, S20-03 Walk-in registration, S20-05 Visitor detail, S20-06 Contractors, S20-07 Gate vehicle log, S20-08 Blacklist, S20-09 Visitor settings |
| <a id="s20-02"></a>S20-02 | Pre-register visitor | App, Web | `/visitor-management/pre-register-visitor` | Host enters the visit and a QR pass is sent | S20-01 Visitors today | S20-04 Visitor pass |
| <a id="s20-03"></a>S20-03 | Walk-in registration | App, Kiosk | `/visitor-management/walk-in-registration` | Name, phone, ID photo, company, host and vehicle | Role home, S20-01 Visitors today | D20-01 Host confirmation, D20-03 Blacklisted visitor |
| <a id="s20-04"></a>S20-04 | Visitor pass | App, Kiosk, Public | `/visitor-management/visitor-pass` | The QR pass on the visitor's phone or printed badge | D20-01 Host confirmation, S20-02 Pre-register visitor | Back only |
| <a id="s20-05"></a>S20-05 | Visitor detail | App, Web | `/visitor-management/visitor-detail/:id` | One visit with times, host and photos | S20-01 Visitors today | D20-02 Sign out visitor |
| <a id="s20-06"></a>S20-06 | Contractors | Web | `/visitor-management/contractors` | Company, work order, insurance and safety briefing | S20-01 Visitors today | Back only |
| <a id="s20-07"></a>S20-07 | Gate vehicle log | App, Kiosk | `/visitor-management/gate-vehicle-log` | Vehicles in and out at the gate with plate, driver and time | Role home, S20-01 Visitors today | Back only |
| <a id="s20-08"></a>S20-08 | Blacklist | Web | `/visitor-management/blacklist` | Blocked visitors with reasons | S20-01 Visitors today | Back only |
| <a id="s20-09"></a>S20-09 | Visitor settings | Web | `/visitor-management/visitor-settings` | Required fields, ID types, approvals and pass lifetime | S20-01 Visitors today | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d20-01"></a>D20-01 | Host confirmation | Host confirms or refuses the visitor | S20-03 Walk-in registration |
| <a id="d20-02"></a>D20-02 | Sign out visitor | Confirm the visitor left | S20-05 Visitor detail |
| <a id="d20-03"></a>D20-03 | Blacklisted visitor | Warning shown at the gate | S20-03 Walk-in registration |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
