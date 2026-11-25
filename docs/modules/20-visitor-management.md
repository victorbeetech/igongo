# 20. Visitors & Contractors

**Group:** Identity and access hardware · **Module key:** `visitor-management` · [All modules](README.md)

## Summary

Registers everyone who comes through the gate who is not staff or a booked guest: suppliers, contractors, job applicants, delivery drivers and official visitors.

## Features
- Pre-registration by the host staff member, with a QR pass sent by SMS or WhatsApp.
- Walk-in registration at the gate: name, phone, ID photo, company, who they are visiting and vehicle plate.
- Host is notified and confirms the visit.
- Visitor badge or temporary QR pass with time limit.
- Sign-out at the gate, with alerts for visitors still inside at closing time.
- Contractor records: company, work order, insurance and safety briefing done.
- Blacklist with reason.

## Super admin options
- Required fields and ID types.
- Which visitor types need host approval.
- Pass lifetime and zones allowed.
- Who can blacklist.


## Depends on

- [Devices & Stations](18-devices-stations.md)
- [Access Control & Zones](19-access-zones.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `visitor.registered`
- `visitor.arrived`
- `visitor.left`
- `visitor.overstayed`
- `visitor.blacklisted`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
