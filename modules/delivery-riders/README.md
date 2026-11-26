# Delivery & Riders (module 66)

Delivers ready orders, with the rider screens in the same app. Spec: [docs/modules/66-delivery-riders.md](../../docs/modules/66-delivery-riders.md).

- **Routes** (`/api/delivery`): `GET /zones`, `GET|PUT /rules`, `GET /board`, `GET /riders`, `POST /jobs/:id/assign`, `POST /riders/:id/cash`, `GET /rider/me`, `POST /rider/online|location`, `POST /jobs/:id/accept|decline|pickup|deliver|fail`, `GET /track/:orderId`.
- **Flow**: Food Ordering marks a delivery order ready → a job opens (waiting) → automatic or dispatcher assignment → the rider accepts, picks up (order "on the way"), and delivers with the guest's 4-digit code (order "delivered"), recording any cash.
- **Rules as data**: zones with fees and times, assignment mode, proof type, cash allowed and limit, pay per trip.
- **Permissions**: `delivery-riders.jobs.view|edit` (scope `assigned` for riders, `all` for dispatchers), `delivery-riders.rules.edit`.
- **Contracts**: gives the `DeliveryDesk` to Food Ordering; uses its `OrderTracker`.
- **Not yet**: delivery zones drawn on a map and turn-by-turn navigation wait for the Google Maps key (the app opens Google Maps with the address or pin).
