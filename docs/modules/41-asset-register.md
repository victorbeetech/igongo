# 41. Asset Register

**Group:** Operations · **Module key:** `asset-register` · [All modules](README.md)

## Summary

A list of the hotel's equipment and property, each with a QR tag, so anyone can scan it to see its details or report a fault on it.

## Features
- Assets with name, category, location, serial, supplier, purchase date, warranty and photo.
- QR tag printing for every asset.
- Assign assets to a person or department, with card-tap sign-off.
- Move assets between locations, with history.
- Warranty and service reminders.
- Maintenance history from [Faults & Maintenance](40-faults-maintenance.md).
- Asset counts and audits by scanning.
- Disposal and write-off with approval.

## Super admin options
- Asset categories and required fields.
- Who can add, move and dispose of assets.
- Audit schedule.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `asset.added`
- `asset.moved`
- `asset.assigned`
- `asset.disposed`
- `asset.warranty_expiring`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
