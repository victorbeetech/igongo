# 15. Locations & Departments

**Group:** Core platform · **Module key:** `locations-departments` · [All modules](README.md)

## Summary

The hotel's structure: sites, buildings, departments, teams, cost centres, rooms, outlets and tables. Every other module picks from this list instead of keeping its own.

## Features
- Sites and areas: hotel block, restaurants, bars, coffee shops, museum, cultural village, pool, spa, grounds, gates.
- Departments and teams, with a head for each.
- Organisation chart built automatically from departments and reporting lines.
- Cost centres for reporting.
- Sales outlets (each restaurant, coffee shop, shop, pool kiosk), with their own opening hours.
- Map and GPS boundary for each area.

## Super admin options
- Add, rename, merge or retire any location or department.
- Opening hours and holidays per outlet.
- Which departments appear in the client view (for example as dining outlets).


## Depends on

- Only the core platform services that every module uses (login, permissions and the audit trail).

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `department.created`
- `department.updated`
- `location.created`
- `location.updated`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
