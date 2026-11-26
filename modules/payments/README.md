# Payments (module 77)

Takes and records every payment for any module. Spec: [docs/modules/77-payments.md](../../docs/modules/77-payments.md).

- **Routes** (`/api/payments`): `GET /methods`, `POST /pay`, `POST /record`, `GET /`, `GET /for/:module/:recordId`, `GET /:id`, `POST /:id/refund`, `POST|PUT /callbacks/:method/:id?`, `GET|PUT /settings`, `GET /connections` (which gateways have keys).
- **Preview mode** (`showPreview`, on by default): `GET /methods` also lists, under `preview`, every gateway whose keys are not saved yet. The screens show them greyed out and labelled "Preview: not connected yet"; they are never payable. A method switched on without keys stays in preview. Turn it off before the App Store build.
- **Double tap**: paying again while the same charge (payer, record, method, amount) is still pending from the last 5 minutes returns that payment instead of charging twice.
- **Selling modules** give the gateway a `Payable` (`@igongo/contracts/payments`): Payments asks it for the bill (total, paid, deposit now, owner, outlet) and tells it about each successful payment. Payments never reads their tables.
- **Providers** (`src/infrastructure/providers/`): MTN MoMo (request to pay), Airtel Money (merchant payments), Flutterwave (hosted card checkout). Each reads its keys from the Super Admin Console at call time; without keys it says exactly which keys to add. Only keys are missing to go live.
- **Callbacks** are never trusted on their own: the payment is found by our own ID and its status is asked of the provider (Flutterwave webhooks must also carry `flutterwave.secret_hash`). A payment leaves `pending` once only.
- **Method switches** (S77-06): every method on or off for the system, then per outlet and module; `sandbox` or `live`. Only cash is on at first.
- **Permissions**: `payments.payments.create|view` (own for guests), `payments.manual.create`, `payments.refunds.approve`, `payments.methods.edit`.
- **Not yet**: refunds go back by hand (the provider refund calls come with live keys); the daily settlement report (S77-07).
