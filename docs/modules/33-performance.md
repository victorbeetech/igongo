# 33. Performance & Appraisals

**Group:** Staff · **Module key:** `performance` · [All modules](README.md)

## Summary

Sets goals and measures how staff are doing, with regular reviews.

## Features
- KPIs per role, such as room cleaning time or orders served.
- Goals per person, with progress updates.
- Appraisal cycles: self review, manager review and meeting.
- 360 feedback from colleagues, if switched on.
- Ratings and comments, with history across years.
- Improvement plans with check-in dates.
- Links to training needs.

## Super admin options
- Review cycles, forms and rating scales.
- KPIs per role, and where each KPI's data comes from.
- Who can see whose reviews.


## Depends on

- [HR Staff Records](22-hr-records.md)
- [Forms & Templates Builder](08-forms-builder.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `appraisal.started`
- `appraisal.completed`
- `goal.updated`
- `improvement_plan.created`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
