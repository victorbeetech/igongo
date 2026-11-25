# Staff Meals (module 32)

Staff meals at the canteen. Spec: [docs/modules/32-staff-meals.md](../../docs/modules/32-staff-meals.md).

- **Routes** (`/api/staff-meals`): `GET /today` (mine), `POST /serve` (card tap, QR or by name), `GET /served`, `GET|PUT /rules`.
- **Rules as data**: meal names and serving times. One of each meal per person per day (enforced by the database too).
- **Permissions**: `staff-meals.claims.view` (scoped), `staff-meals.claims.create` (scope all: canteen), `staff-meals.rules.edit`.
