# 61. Menus & Catalogue

**Group:** Guests and sales · **Module key:** `menu-catalogue` · [All modules](README.md)

## Summary

The master list of everything the kitchen, bars and coffee shops sell, kept separate from ordering so menus can be changed without touching orders.

## Features
- Menus per outlet and time (breakfast, lunch, dinner, room service, staff canteen, events).
- Items with photos, description, portion sizes and options (such as "1 kg", "half kg", "well done").
- Extras and add-ons.
- Allergens and dietary tags (vegetarian, halal, spicy).
- Out of stock switch for today, from the kitchen.
- Event and buffet menus and set packages.
- Prep time per item, used for pre-orders.

## Super admin options
- Who can edit menus and prices.
- Which menus show in the client view.
- Menu schedules.


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Files & Media](11-files-media.md)
- [Prices, Taxes & Discounts](76-pricing-tax.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `menu.published`
- `item.updated`
- `item.out_of_stock`
- `item.back_in_stock`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
