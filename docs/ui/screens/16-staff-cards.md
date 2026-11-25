# S16. NFC & QR Staff Cards

[All screens](README.md) · [Module spec](../../modules/16-staff-cards.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s16-01"></a>S16-01 | Cards home | Web | `/staff-cards/cards-home` | Cards issued, waiting to print, blocked, expiring, and print queue status | Role home | S16-02 Card templates, S16-06 Card types, S16-08 Cards list, S16-10 Issue card, S16-20 Clone alerts, S16-21 Card settings, S16-22 Card requests |
| <a id="s16-02"></a>S16-02 | Card templates | Web | `/staff-cards/card-templates` | Every template, portrait and landscape, with the default marked | S16-01 Cards home | S16-03 Card designer, S16-05 Template assignment |
| <a id="s16-03"></a>S16-03 | Card designer | Web | `/staff-cards/card-designer` | Drag and drop front and back design with brand-only colours, fonts and logos | S16-02 Card templates, [S17-12 Band designs](17-wristbands.md#s17-12) | S16-04 Template preview |
| <a id="s16-04"></a>S16-04 | Template preview | Web | `/staff-cards/template-preview` | Live preview with a real person's data and a long-name fit check | S16-03 Card designer | D16-06 Publish template |
| <a id="s16-05"></a>S16-05 | Template assignment | Web | `/staff-cards/template-assignment` | Which template each role, department and card type uses | S16-02 Card templates | Back only |
| <a id="s16-06"></a>S16-06 | Card types | Web | `/staff-cards/card-types` | Size, print preset, printer profile and chip for each card type | S16-01 Cards home | S16-07 Card type editor |
| <a id="s16-07"></a>S16-07 | Card type editor | Web | `/staff-cards/card-type-editor/:id` | Chip settings: what is written, password lock, originality and tap counter checks | S16-06 Card types | Back only |
| <a id="s16-08"></a>S16-08 | Cards list | App, Web | `/staff-cards/cards-list` | Every card with holder, status, type and expiry, with filters | S16-01 Cards home | S16-09 Card detail |
| <a id="s16-09"></a>S16-09 | Card detail | App, Web | `/staff-cards/card-detail/:id` | One card: holder, status, history of holders, taps and prints | S16-08 Cards list, S16-20 Clone alerts, [S22-02 Staff profile](22-hr-records.md#s22-02) | D16-01 Print card, D16-02 Download card, D16-03 Block card, D16-04 Replace card, S16-18 Reset card |
| <a id="s16-10"></a>S16-10 | Issue card | App, Web | `/staff-cards/issue-card` | Pick a person, template and card type, then print and encode | D16-04 Replace card, D16-05 Reset and reassign, S16-01 Cards home, S16-16 Unassigned card, S16-22 Card requests | S16-11 Print queue |
| <a id="s16-11"></a>S16-11 | Print queue | Web | `/staff-cards/print-queue` | Cards waiting to print, printing and printed, per printer | Role home, S16-10 Issue card | S16-12 Print log, S16-13 Encode card |
| <a id="s16-12"></a>S16-12 | Print log | Web | `/staff-cards/print-log` | Every print with who, when, printer and copies | S16-11 Print queue | Back only |
| <a id="s16-13"></a>S16-13 | Encode card | App, Kiosk | `/staff-cards/encode-card` | Hold the card to the phone or reader to write and lock the chip | D16-07 Chip write failed, S16-11 Print queue | D16-07 Chip write failed, S16-14 Test card |
| <a id="s16-14"></a>S16-14 | Test card | App, Kiosk | `/staff-cards/test-card` | Tap to check the chip and QR open the right record | S16-13 Encode card | Back only |
| <a id="s16-15"></a>S16-15 | Who owns this card | App, Kiosk | `/staff-cards/who-owns-this-card` | Tap or scan any card: photo, name, role, status and on duty, by viewer permission | Role home | S16-16 Unassigned card, S16-17 Card warning, [S22-02 Staff profile](22-hr-records.md#s22-02) |
| <a id="s16-16"></a>S16-16 | Unassigned card | App, Kiosk | `/staff-cards/unassigned-card` | Shown when a tapped card has no holder, with an option to assign it | S16-15 Who owns this card | S16-10 Issue card |
| <a id="s16-17"></a>S16-17 | Card warning | App, Kiosk | `/staff-cards/card-warning` | Shown for a blocked, lost or expired card, with security alerted | S16-15 Who owns this card | [S45-04 Report incident](45-security-incidents.md#s45-04) |
| <a id="s16-18"></a>S16-18 | Reset card | App, Kiosk | `/staff-cards/reset-card` | Wipe the chip, unlink the holder and return the card to stock | S16-09 Card detail | D16-05 Reset and reassign |
| <a id="s16-19"></a>S16-19 | My card | App | `/staff-cards/my-card` | The holder's own card, front and back, with download and report lost | Role home | D16-02 Download card, D16-03 Block card |
| <a id="s16-20"></a>S16-20 | Clone alerts | Web | `/staff-cards/clone-alerts` | Cards used in two places at once or failing the originality check | S16-01 Cards home | S16-09 Card detail |
| <a id="s16-21"></a>S16-21 | Card settings | Web | `/staff-cards/card-settings` | Who can design, print, encode, assign and block, approvals and fees | S16-01 Cards home | Back only |
| <a id="s16-22"></a>S16-22 | Card requests | App, Web | `/staff-cards/card-requests` | Requests for new, replacement and lost cards, waiting for approval or print | Role home, S16-01 Cards home | S16-10 Issue card |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d16-01"></a>D16-01 | Print card | Choose printer and copies, front and back, then print | S16-09 Card detail |
| <a id="d16-02"></a>D16-02 | Download card | PDF print-ready or PNG, front and back | S16-09 Card detail, S16-19 My card |
| <a id="d16-03"></a>D16-03 | Block card | Reason, lost or stolen, and alert security | S16-09 Card detail, S16-19 My card |
| <a id="d16-04"></a>D16-04 | Replace card | Reason, fee if any, and approval if needed | S16-09 Card detail |
| <a id="d16-05"></a>D16-05 | Reset and reassign | Confirm wiping the chip and unlinking the current holder | S16-18 Reset card |
| <a id="d16-06"></a>D16-06 | Publish template | Confirm, and whether to reprint existing cards | S16-04 Template preview |
| <a id="d16-07"></a>D16-07 | Chip write failed | Hold the card still and try again, or use another card | S16-13 Encode card |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
