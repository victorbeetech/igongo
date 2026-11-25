# 73. Crafts & Bookshop

**Group:** Guests and sales · **Module key:** `crafts-bookshop` · [All modules](README.md)

## Summary

Sells crafts, books and souvenirs at the shop and online.

## Features
- Product catalogue with photos, barcodes and categories.
- Point of sale on a phone or tablet, with barcode scan.
- Online shop in the app, with pickup or delivery.
- Artisan and consignment records: who made it and what they are owed.
- Simple item counts for the shop only.
- Sales reports by product and artisan.

## Super admin options
- Categories and which products show online.
- Consignment terms.


## Depends on

- [Payments](77-payments.md)
- [Locations & Departments](15-locations-departments.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `shop.sale`
- `shop.online_order`
- `shop.item_low`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
