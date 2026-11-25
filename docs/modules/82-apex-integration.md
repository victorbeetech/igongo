# 82. APEX Integration

**Group:** Money and insight · **Module key:** `apex-integration` · [All modules](README.md)

## Summary

Connects the new system to APEX, the hotel's existing system, so the two work together and never conflict. APEX is not replaced.

## Features
- Read rooms, room types, rates and availability from APEX.
- Send bookings made in the app to APEX.
- Read in-house guests, so room service and charge-to-room work.
- Send charges to a guest's room folio.
- Match guests between APEX and the CRM.
- Sync log with errors, retries and manual fix screen.
- Works through whatever APEX offers (API, database link or file exchange), to be confirmed with the hotel and the vendor.

## Super admin options
- What syncs, in which direction, and how often.
- What to do when APEX is offline.
- Who is alerted on sync errors.


## Depends on

- [Integrations Hub & Webhooks](14-integrations-hub.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `apex.sync_completed`
- `apex.sync_failed`
- `apex.booking_sent`
- `apex.charge_posted`

## If this module is switched off or fails

Room bookings switch to request mode and charge-to-room is hidden. Everything else keeps working.
