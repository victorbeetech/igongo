# 16. NFC & QR Staff Cards

**Group:** Identity and access hardware · **Module key:** `staff-cards` · [All modules](README.md)

## Summary

Issues and controls the staff ID card. Each card has an NFC chip and a printed QR code, and links to the staff member's full profile on the server. The card itself holds only a secure ID, so a lost card exposes nothing.

## Features

### Issue and print
- Card designer: photo, name, role, department, staff number, QR code, expiry and emergency contact.
- Print to a card printer, or export print-ready sheets.
- Encode the NFC chip from a phone or desk reader, then tap to test.
- Card types: permanent staff, casual, intern, contractor, visitor and board member.

### Life of a card
- Activate, suspend, block, replace and retire.
- Lost card: block in one tap from any manager's phone, then reissue with a new chip ID.
- Expiry dates and renewal reminders.
- Full history of every card a person has held.

### What a tap shows
- Tap or scan on a permitted device to open the staff profile, as allowed by the viewer's role: photo, role, department, on duty or not, and allowed zones.
- Offline check against a signed list on the device, for gates with weak network.
- Anti-cloning: chip ID plus a server-checked secret, and alerts when one card is used in two places at once.

### Uses across modules
- Clock in and out ([Attendance](25-attendance.md)), meal claims ([Staff Meals](32-staff-meals.md)), buffet bonuses ([Bonuses & Rewards](31-bonuses-rewards.md)), door and zone access ([Access Control & Zones](19-access-zones.md)), login on shared devices, and signing for keys and assets.

## Super admin options
- Card design templates per card type.
- Which fields are printed and which appear on a tap, per viewer role.
- Who can issue, block and reissue cards.
- Whether a replacement card needs approval, and whether a replacement fee is recorded.
- Offline list refresh interval for gate devices.


## Depends on

- [Devices & Stations](18-devices-stations.md)
- [HR Staff Records](22-hr-records.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `card.issued`
- `card.activated`
- `card.blocked`
- `card.replaced`
- `card.tapped`
- `card.clone_suspected`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
