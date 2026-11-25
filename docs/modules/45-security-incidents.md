# 45. Security, Patrols & Incidents

**Group:** Operations · **Module key:** `security-incidents` · [All modules](README.md)

## Summary

Guard patrols, incident reports and emergencies across the hotel and cultural centre.

## Features
- Guard tours: scan QR checkpoints on a route, with times and missed checkpoints flagged.
- Incident reports with photos, people involved and witnesses: theft, fight, injury, fire, trespass.
- Panic button in the app that alerts security and managers with the person's location.
- Emergency broadcast to all staff on site.
- Roll call using the live attendance board.
- Gate log of vehicles in and out.
- Police case numbers and follow-up.

## Super admin options
- Patrol routes and checkpoints.
- Incident types and who is alerted for each.
- Who can use the panic button.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Devices & Stations](18-devices-stations.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `patrol.completed`
- `patrol.checkpoint_missed`
- `incident.reported`
- `panic.triggered`
- `emergency.broadcast`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
