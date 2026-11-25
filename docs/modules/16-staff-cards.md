# 16. NFC & QR Staff Cards

**Group:** Identity and access hardware · **Module key:** `staff-cards` · [All modules](README.md)

## Summary

Designs, prints and controls every ID card: staff, casual, intern, contractor, visitor and board member. Every card has a working NFC chip and a working QR code that open the holder's record. The super admin designs card templates and card types without code, so the hotel can change its card design or its card chips at any time.

## Features

### Card designer (no code)
- Drag-and-drop designer for the front and back of a card, in portrait or landscape.
- Building blocks: logo, photo (round or square), name, role, department, staff number, any field from [HR Staff Records](22-hr-records.md) or [Custom Fields](07-custom-fields.md), QR code, barcode, NFC symbol, issue and expiry dates, signature, terms text, shapes, bands, patterns and background images.
- Only the brand colours, fonts and logos from the [brand kit](../../packages/brand/README.md) are offered, so every design stays on brand.
- Live preview with a real staff member's data, and a check that the text fits for long names.
- A library of ready-made templates (portrait and landscape) to start from, which the super admin can clone and change. The black portrait template is the default for every role until the super admin assigns another.
- Versions: changing a template never changes cards already printed, unless they are reprinted.

### Templates per role
- Assign a template to each role, department or card type, such as one design for managers, one for kitchen staff, one for security and one for visitors.
- A person with several roles gets the template of their main role, or one chosen by the super admin.
- Colour band or label per department, so a guard can tell departments apart at a glance.

### Card types (no code)
- Each card type records its physical size and print settings: CR80 (85.6 × 54 mm) by default, or any other size.
- Each card type records its chip: the hotel's current cards are **NXP NTAG213** (NFC Forum Type 2, 180 bytes), and other chips such as NTAG215/216 or NTAG 424 DNA can be added later as data.
- Chip settings per type: what is written to the chip, password lock, and whether the tap counter and originality signature are checked.

### Print in one click
- Each card type has a preset print size, margins, orientation, bleed and printer profile, so cards print correctly with no editing.
- Print one card, a batch (such as all new staff this week) or a reprint, straight to a connected card printer from the web portal or a paired device.
- Printer setup: pick the printer once per station in [Devices & Stations](18-devices-stations.md).
- Print queue with status, and a log of every print.
- Download any card as print-ready PDF (with exact size and bleed) or as PNG, front and back.

### Encode and test
- Write the chip from a phone or desk reader as part of printing: a secure card ID and a link that opens the record.
- Lock the chip with a password after writing, so it can't be overwritten by someone else.
- Tap to test before handing the card over.

### Who does this card belong to?
- Tap or scan any card on a permitted device to see who it belongs to: photo, name, role, department, status (active, blocked, expired) and whether they are on duty.
- More details appear according to the viewer's role, up to the holder's full record for HR and the super admin. The record always comes from the server.
- An unassigned card shows "not assigned" and offers to assign it.
- A blocked, lost or expired card shows a clear warning and alerts security.

### Life of a card
- Assign a card to a person, activate, suspend, block, replace and retire it.
- **Reset and reassign:** wipe a card (format the chip and unlink it from its holder), then assign it to someone else. The full history of past holders is kept.
- Lost card: block it in one tap from any manager's phone, then reissue a new one.
- Expiry dates and renewal reminders.
- Full history of every card a person has held, and every person a card has belonged to.

### Security
- The chip holds only a secure ID and a link, never personal data, so a lost card exposes nothing. All details come from the server, by permission.
- NTAG213 chips have no encryption, so the system also checks the chip's factory originality signature, the password lock, and the tap counter where it is on, and alerts when one card is used in two places at once.
- Offline check against a signed list on the device, for gates with weak network.
- NTAG 424 DNA cards, which make a new signed code on every tap, can be switched on as a card type when the hotel next buys cards.

### Uses across modules
- Clock in and out ([Attendance](25-attendance.md)), meal claims ([Staff Meals](32-staff-meals.md)), buffet bonuses ([Bonuses & Rewards](31-bonuses-rewards.md)), door and zone access ([Access Control & Zones](19-access-zones.md)), login on shared devices, and signing for keys and assets.

## Super admin options
- Design, clone, version and retire card templates, front and back, portrait or landscape.
- Assign templates to roles, departments and card types.
- Create card types: size, print preset, printer profile and chip settings.
- Which fields are printed, and which appear on a tap for each viewer role.
- Who can design, print, encode, assign, reset, block and reissue cards.
- Whether a replacement card needs approval, and whether a replacement fee is recorded.
- Offline list refresh interval for gate devices.


## Depends on

- [Devices & Stations](18-devices-stations.md)
- [HR Staff Records](22-hr-records.md)
- [Custom Fields](07-custom-fields.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `cardtemplate.published`
- `card.printed`
- `card.encoded`
- `card.issued`
- `card.activated`
- `card.blocked`
- `card.reset`
- `card.reassigned`
- `card.replaced`
- `card.tapped`
- `card.clone_suspected`

## If this module is switched off or fails

Cards already printed keep working for attendance and access through the offline list. Designing, printing and assigning cards pause.
