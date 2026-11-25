# S75. Public Website & Online Booking

[All screens](README.md) · [Module spec](../../modules/75-public-website.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s75-01"></a>S75-01 | Website home | Public | `/public-website/website-home` | Rooms, dining, museum, events, pool, spa and shop | Not connected yet | S75-02 Website page, S75-04 Gallery, S75-05 News, S75-06 Contact, S75-08 Cookie consent, [S08-10 Public form](08-forms-builder.md#s08-10), [S23-03 Jobs page](23-recruitment.md#s23-03), [S46-04 Lost item report](46-lost-found.md#s46-04), [S64-05 Table QR menu](64-tables-dinein.md#s64-05), [S78-05 Check a receipt](78-receipts-invoicing.md#s78-05) |
| <a id="s75-02"></a>S75-02 | Website page | Public | `/public-website/website-page` | Any content page managed by the super admin | S75-01 Website home | S75-03 Website booking |
| <a id="s75-03"></a>S75-03 | Website booking | Public | `/public-website/website-booking` | Booking and ordering using the same flows as the app | S75-02 Website page | [S67-03 Pick dates](67-room-bookings.md#s67-03) |
| <a id="s75-04"></a>S75-04 | Gallery | Public | `/public-website/gallery` | Photos and virtual tours | S75-01 Website home | Back only |
| <a id="s75-05"></a>S75-05 | News | Public | `/public-website/news` | Blog and news posts | S75-01 Website home | Back only |
| <a id="s75-06"></a>S75-06 | Contact | Public | `/public-website/contact` | Contact form, map and details | S75-01 Website home | D75-01 Enquiry sent |
| <a id="s75-07"></a>S75-07 | Pages editor | Web | `/public-website/pages-editor/:id` | Pages, menus, content and photos | Role home | Back only |
| <a id="s75-08"></a>S75-08 | Cookie consent | Public | `/public-website/cookie-consent` | Consent banner and settings | S75-01 Website home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d75-01"></a>D75-01 | Enquiry sent | Confirmation with what happens next | S75-06 Contact, [S69-02 Event enquiry](69-events-conferences.md#s69-02) |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
