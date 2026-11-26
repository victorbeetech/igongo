# Food Ordering (module 62)

Every food order of every type. Spec: [docs/modules/62-food-ordering.md](../../docs/modules/62-food-ordering.md).

- **Routes** (`/api/orders`): `GET|PUT /rules`, `POST /quote`, `POST /`, `GET /mine`, `GET /board`, `GET /:id`, `POST /:id/status`, `POST /:id/cancel`.
- **Order types**: delivery, room service, dine-in, takeaway and pre-order with an arrival time ("1 kg fried beef, we arrive at 4 PM"). Each is on or off per outlet, and paid before, by deposit, or later (S62-16).
- **Flow**: awaiting payment (when the type needs money first) → received → preparing → ready → on the way (deliveries, by the rider) → delivered; or cancelled before it leaves.
- **Ready time**: the slowest item's prep time plus the kitchen queue; a pre-order is ready at arrival, and needs enough notice.
- **Uses**: the `MenuReader` (Menus & Catalogue), the `DeliveryDesk` (Delivery & Riders) for zone fees and to open delivery jobs. **Gives**: a `Payable` (Payments) and the `OrderTracker` (Delivery & Riders).
- **Permissions**: `food-ordering.orders.create|view` (own for guests, wider for waiters and the board), `food-ordering.orders.edit` or `kitchen-display.tickets.edit`, `food-ordering.rules.edit`.
