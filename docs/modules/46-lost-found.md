# 46. Lost & Found

**Group:** Operations · **Module key:** `lost-found` · [All modules](README.md)

## Summary

Records items found and claimed, for guests and staff.

## Features
- Log a found item with photo, place found and who found it.
- Storage location and tag number.
- Guests report a lost item in the app; possible matches are suggested.
- Hand over with ID check and signature.
- Disposal or donation after the holding period.

## Super admin options
- Holding periods per item type.
- Who can hand over items.


## Depends on

- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `item.found`
- `item.claimed`
- `item.disposed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
