# 19. Access Control & Zones

**Group:** Identity and access hardware · **Module key:** `access-zones` · [All modules](README.md)

## Summary

Defines restricted areas, such as the store, kitchen, server room, VIP area or event hall, and who may enter each one and when, using staff cards, wristbands or QR codes.

## Features
- Zones with a name, map area, and the devices or doors that guard them.
- Rules by role, person, card type, wristband range, day and time.
- Check at a door reader or by a guard scanning with a phone.
- Live view of who is inside each zone.
- Log of every entry and every refusal, with a photo if the device has a camera.
- Lockdown: close a zone to everyone in an emergency.
- Temporary passes for contractors and visitors.

## Super admin options
- Create and edit zones and their rules.
- Who receives alerts for refused entries.
- Whether guards can override a refusal, and whether an override needs a reason.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Devices & Stations](18-devices-stations.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `zone.entry_allowed`
- `zone.entry_denied`
- `zone.override`
- `zone.lockdown_started`
- `zone.lockdown_ended`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
