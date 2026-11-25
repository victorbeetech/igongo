# S54. CRM: Guest & Client Profiles

[All screens](README.md) · [Module spec](../../modules/54-crm-guests.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s54-01"></a>S54-01 | Guests list | Web | `/crm-guests/guests-list` | Guests and clients with tags, segments and spend | Role home | S54-02 Guest profile, S54-03 Segments, S54-04 Duplicates, S54-08 CRM settings |
| <a id="s54-02"></a>S54-02 | Guest profile | App, Web | `/crm-guests/guest-profile/:id` | Details, preferences, stays, orders, bookings, feedback and notes | S54-01 Guests list, [S67-12 In-house guests](67-room-bookings.md#s67-12) | [S05-03 Record timeline](05-audit-trail.md#s05-03) |
| <a id="s54-03"></a>S54-03 | Segments | Web | `/crm-guests/segments` | Saved segments such as VIP, regular or wedding clients | S54-01 Guests list | Back only |
| <a id="s54-04"></a>S54-04 | Duplicates | Web | `/crm-guests/duplicates` | Possible duplicate guests to merge | S54-01 Guests list | D54-01 Merge guests |
| <a id="s54-05"></a>S54-05 | My account | App | `/crm-guests/my-account` | The guest's own profile, bookings, orders, receipts and points | Role home | D54-02 Delete my account, S54-06 Edit my details, S54-07 Consent, [S57-01 My points](57-loyalty.md#s57-01), [S59-05 My vouchers](59-promotions-vouchers.md#s59-05), [S62-11 My orders](62-food-ordering.md#s62-11), [S67-06 My bookings](67-room-bookings.md#s67-06), [S78-06 My receipts](78-receipts-invoicing.md#s78-06) |
| <a id="s54-06"></a>S54-06 | Edit my details | App | `/crm-guests/edit-my-details` | Name, phone, email, photo and preferences | S54-05 My account | Back only |
| <a id="s54-07"></a>S54-07 | Consent | App | `/crm-guests/consent` | SMS, WhatsApp and email marketing choices | S54-05 My account | Back only |
| <a id="s54-08"></a>S54-08 | CRM settings | Web | `/crm-guests/crm-settings` | Profile fields and tags; Who can see contact details and spend; Segment rules; Data retention for inactive guests | S54-01 Guests list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d54-01"></a>D54-01 | Merge guests | Confirm which record to keep | S54-04 Duplicates |
| <a id="d54-02"></a>D54-02 | Delete my account | Explain what is removed and confirm | S54-05 My account |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
