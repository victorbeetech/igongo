# Food Ordering (module 62)

Every food order of every type. Spec: [docs/modules/62-food-ordering.md](../../docs/modules/62-food-ordering.md).

- **Routes** (`/api/orders`): `GET|PUT /rules`, `POST /quote`, `POST /`, `GET /mine`, `GET|PUT|DELETE /dishes/:itemId` (saved dishes, the heart), `GET /stars`, `GET /reviews` (`all=1` for staff), `POST /reviews/:orderId/hide`, `GET /board`, `GET /:id`, `POST /:id/status`, `POST /:id/cancel`, `POST /:id/rating`, `GET /:id/reorder`.
- **Prices**: always worked out here, on the server: lines with options, the zone's delivery fee, and a promo or voucher code through the `PromoDesk` (Promotions & Vouchers). The discount never exceeds the food. The app's numbers are never used.
- **Scheduled orders**: delivery, takeaway and room service may carry a wanted time (`arriveAt`), up to `scheduleAheadDays` ahead (0 turns it off); the kitchen gets it ready in time to travel.
- **Double tap**: the app sends one `requestKey` per checkout; the same key from the same person returns the same order.
- **Ratings and reviews**: one per delivered order, by the guest who ordered (food stars, delivery stars for deliveries, a short review). Staff can hide a review. The menu shows each dish's average. Reviews show the first name only.
- **Order again**: the same dishes at today's prices; dishes off the menu are named and left out.
- **Push**: the guest hears about received, preparing, ready, served and cancelled through the `UserNotifier` (Notifications). Someone else's order answers 403.
- **Order types**: delivery, room service, dine-in, takeaway and pre-order with an arrival time ("1 kg fried beef, we arrive at 4 PM"). Each is on or off per outlet, and paid before, by deposit, or later (S62-16).
- **Flow**: awaiting payment (when the type needs money first) → received → preparing → ready → on the way (deliveries, by the rider) → delivered; or cancelled before it leaves.
- **Ready time**: the slowest item's prep time plus the kitchen queue; a pre-order is ready at arrival, and needs enough notice.
- **Uses**: the `MenuReader` (Menus & Catalogue), the `DeliveryDesk` (Delivery & Riders) for zone fees and to open delivery jobs. **Gives**: a `Payable` (Payments) and the `OrderTracker` (Delivery & Riders).
- **Permissions**: `food-ordering.orders.create|view` (own for guests, wider for waiters and the board), `food-ordering.orders.edit` or `kitchen-display.tickets.edit`, `food-ordering.rules.edit`.
