# 18. Devices & Stations

**Group:** Identity and access hardware · **Module key:** `devices-stations` · [All modules](README.md)

## Summary

A register of every phone, tablet, handheld, card reader, printer and kiosk the hotel uses, and the station each one serves.

## Features
- Register devices with name, type, serial, location and station (gate, reception, kitchen pass, food line, pool entrance).
- Pair a device with a QR code shown on the web portal.
- Kiosk mode: lock a tablet to one screen, such as the clock-in screen.
- Online status, battery, app version and last seen time.
- Remote lock, wipe and sign-out.
- Assign receipt printers and kitchen printers to stations.
- Device health alerts: offline too long, battery low, wrong location.

## Super admin options
- Station types and what each station does.
- Which roles can use which station.
- Alert rules for offline devices.
- Whether personal phones may be used as stations.


## Depends on

- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `device.registered`
- `device.offline`
- `device.online`
- `device.locked`
- `device.wiped`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
