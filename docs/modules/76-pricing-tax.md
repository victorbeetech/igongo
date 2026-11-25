# 76. Prices, Taxes & Discounts

**Group:** Money and insight · **Module key:** `pricing-tax` · [All modules](README.md)

## Summary

The single source of every price, tax and discount rule, so a price changes in one place and every outlet uses it.

## Features
- Price lists per outlet, season, client type (resident, non-resident, corporate, staff) and time of day.
- Price change scheduling with start and end dates.
- Taxes: VAT and any other levy, inclusive or exclusive, per item type.
- Service charge rules.
- Discount rules: percentage, fixed, buy X get Y, staff discount.
- Rounding rules for cash.
- Price history for every item.

## Super admin options
- Who can change prices, and whether changes need approval.
- Tax rates and which items they apply to.
- Staff discount rules.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Workflow & Approvals](09-workflow-approvals.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `price.changed`
- `tax.changed`
- `discount_rule.changed`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
