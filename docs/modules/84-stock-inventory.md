# 84. Stock & Inventory

**Group:** Operations · **Module key:** `stock-inventory` · [All modules](README.md)

## Summary

Tracks everything the hotel buys, stores and uses: food, drinks, cleaning supplies, linen, amenities, stationery, craft and shop items, fuel and spare parts. Every store, item, unit, rule and approval is set by the super admin with no code, so the module fits how each store works today and can change at any time. It complements APEX and does not replace it.

## Features

### Stores and items (no code)
- Any number of stores and sub-stores, such as main store, kitchen store, bar store, housekeeping store, maintenance store, shop and fuel tank, each with its own keeper and location.
- Item categories and sub-categories, created by the super admin.
- Items with photo, code, barcode or QR, category, units, storage conditions, shelf location and suppliers.
- Units and conversions as data, such as 1 crate = 24 bottles, 1 sack = 50 kg, 1 kg = 1,000 g, so items are bought in one unit and issued in another.
- Custom fields on any item or movement through [Custom Fields](07-custom-fields.md), such as batch number, colour or size.
- Tracking per item: plain count, batch and expiry date, or serial number.
- Minimum, reorder and maximum levels per item per store.

### Receiving
- Goods received notes: from a supplier delivery or a purchase order, counted against what was ordered.
- Short, damaged or rejected items recorded with photos and a reason.
- Delivery note and invoice photo attached.
- Batch and expiry captured at receiving where the item needs it.
- Optional quality check form from the [Forms Builder](08-forms-builder.md), such as checking the temperature of meat on delivery.

### Requisitions and issues
- Any department asks for items from a store in the app, such as the kitchen asking for 20 kg of rice for tomorrow.
- Approval path per store, department, item category or value, set in [Workflow & Approvals](09-workflow-approvals.md).
- The store keeper issues full or part quantities, and the receiver confirms with a card tap or signature.
- Issue by scanning item QR or barcode.
- Transfers between stores, with sender and receiver confirmation.

### Purchasing (can be switched off)
- Purchase requests raised from low stock or by hand, with approval.
- Purchase orders to suppliers, sent by email or WhatsApp, with expected delivery date.
- Supplier list with contacts, items supplied, lead times and performance (late, short, rejected).
- Compare up to three supplier quotes before ordering.
- Prices are entered and kept in the system, never in code.

### Counts and control
- Stock counts: full, by store, by category or spot checks on random items, done on a phone with a scanner.
- Blind counts, where the counter does not see the expected quantity.
- Variance report after each count, with approval of adjustments and a reason for every one.
- Wastage, breakage, spoilage and expiry recorded with photo and reason.
- Expiry alerts and first-expiry, first-out picking suggestions.
- Movement history for every item: who received, issued, moved, counted or adjusted it, and when.

### Recipes and usage (optional)
- Link a menu item to its ingredients and quantities, so each sale from [Food Ordering](62-food-ordering.md) reduces the kitchen store in theory, and the count shows the real usage.
- Usage versus sales report per outlet and per day.
- Room amenity and minibar refills from [Housekeeping](43-housekeeping.md) deduct from the housekeeping store.

### Reports
- Stock on hand and stock value per store, category and item.
- Low stock, overstock, slow-moving and dead stock.
- Consumption per department, cost centre and period.
- Receiving and supplier reports.
- Variance and wastage trends.

## Super admin options
- Create, rename, merge and close stores, categories, units and conversions.
- Which fields each item and movement needs, and which are hidden.
- Tracking type per category: count, batch and expiry, or serial.
- Valuation method per store: average cost, first in first out, or last price.
- Approval rules for requisitions, transfers, purchases, adjustments and write-offs, by value, item category, store and department.
- Who can view stock values and prices, and who sees only quantities.
- Reorder rules: alert only, raise a purchase request, or both, and who is told.
- Count schedules and whether counts are blind.
- Whether purchasing, recipes and supplier quotes are switched on.
- Which stores each role can see and work in.
- Notification rules for low stock, expiry, large variances and unapproved issues.
- Import items, opening stock and suppliers from a spreadsheet through [Import & Export](13-import-export.md).


## Depends on

- [Locations & Departments](15-locations-departments.md)
- [Workflow & Approvals](09-workflow-approvals.md)
- [Custom Fields](07-custom-fields.md)
- [Forms & Templates Builder](08-forms-builder.md)
- [Files & Media](11-files-media.md)
- [Devices & Stations](18-devices-stations.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `stock.received`
- `stock.requested`
- `stock.issued`
- `stock.transferred`
- `stock.counted`
- `stock.adjusted`
- `stock.wasted`
- `stock.low`
- `stock.expiring`
- `purchase.requested`
- `purchase.ordered`
- `purchase.received`

## If this module is switched off or fails

Stores keep working on paper. Menus, food ordering, housekeeping and every other module keep working and simply stop sending usage. Movements entered offline in the app sync when the module is back.
