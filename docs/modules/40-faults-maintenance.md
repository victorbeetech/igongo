# 40. Faults & Maintenance

**Group:** Operations · **Module key:** `faults-maintenance` · [All modules](README.md)

## Summary

Anyone can report a fault with a photo, such as "the slasher's stone cracked the door glass". The right people see it, like and comment on it, and it is tracked until fixed.

## Features

### Report
- Report from the app with photo or video, location, asset (by QR scan) and urgency.
- Categories: electrical, water, plumbing, carpentry, building, grounds, kitchen equipment, IT, vehicles and any custom type.
- Report on behalf of a guest.

### The fault feed
- Each fault appears in a feed for the people concerned (the category's team, the area's manager).
- Likes, comments and "I've seen this too", so repeat reports join the first one instead of making duplicates.
- Who saw it and when.

### Work orders
- Assign to a technician or team, with a due time based on urgency.
- Status: reported, assigned, in progress, waiting for parts, fixed, verified, closed.
- Before and after photos.
- Parts and labour cost, and outside contractor details.
- The reporter is told when it is fixed and can confirm.

### Planned maintenance
- Schedules per asset: generator service, pool pump, fire extinguishers, AC cleaning.
- Calendar of upcoming jobs.

### Insight
- Time to fix, cost per area, repeat faults and technician workload.

## Super admin options
- Fault categories, urgency levels and target fix times.
- Who sees each category's feed, and who can comment or like.
- Who assigns and who closes.
- Whether the reporter must verify the fix.


## Depends on

- [Asset Register](41-asset-register.md)
- [Files & Media](11-files-media.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `fault.reported`
- `fault.assigned`
- `fault.commented`
- `fault.fixed`
- `fault.closed`
- `fault.overdue`
- `maintenance.due`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
