# 17. Event Wristbands

**Group:** Identity and access hardware · **Module key:** `wristbands` · [All modules](README.md)

## Summary

Manages 3,000 to 5,000 reusable NFC and QR wristbands. Bands are registered once, then assigned to an event in number ranges, used for entry, meals or drinks, and reset in bulk afterwards.

## Features

### Stock of bands
- Register bands once in bulk: band number, NFC chip ID and QR code, by scanning or by spreadsheet import.
- Colours and types (such as VIP, guest, crew, child).
- Status for each band: in store, assigned, in use, lost, damaged or retired.
- Store location and count by status.

### Assign by range
- Assign a range such as 1–200 to an event or booking in one step.
- Several ranges per event, and different access per range (for example 1–20 VIP, 21–200 standard).
- Optional: link a band to a named attendee.
- Preview conflicts before assigning (bands already in use or lost).

### Access rules per band
- Entry to the event, zones allowed, number of meals or drinks, time window and re-entry allowed or not.
- Top-up or extra entitlements during the event.
- Scan at the gate or the food line with a phone or handheld, online or offline.

### After the event
- Reset a whole range ("reset 1–200") in one step, which clears entitlements and returns the bands to store.
- Reassign a range straight to another event.
- Missing band report: assigned but not returned, with a charge recorded if the client agreed to one.
- Block a lost band instantly.

### Records
- Scan log: every tap, where, when, by which device and whether it was allowed.
- Event summary: bands used, meals served, peak entry times.

## Super admin options
- Band types, colours and default entitlements.
- Who can assign, reset and block ranges.
- Whether a reset needs approval.
- Whether bands can be linked to named people.
- Missing band charge policy text.


## Depends on

- [Devices & Stations](18-devices-stations.md)
- [Access Control & Zones](19-access-zones.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `wristband.registered`
- `wristband.range_assigned`
- `wristband.range_reset`
- `wristband.scanned`
- `wristband.denied`
- `wristband.lost`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
