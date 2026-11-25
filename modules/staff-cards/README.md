# Staff Cards (module 16)

NFC and QR staff cards. Spec: [docs/modules/16-staff-cards.md](../../docs/modules/16-staff-cards.md).

- **Routes** (`/api/cards`): `GET /mine`, `GET /summary`, `GET /`, `POST /` (register a blank card), `POST /resolve` (who owns this card), `GET /:id` (with holder and history), `POST /:id/issue`, `/:id/encode`, `/:id/reset`, `/:id/lost`.
- **QR code**: `IGG-CARD:<random token>`. A reset gives a new token, so old prints stop working. Chip UIDs are stored as upper-case hex (`normalizeUid` in `@igongo/core`).
- **Contract for other modules**: `CardResolver` in `packages/contracts/staff-cards`.
- **Schema** `cards`: `cards`, `card_history` (who held each card, and when).
- **Permissions**: `staff-cards.cards.view`, `.create` (register, issue), `.edit` (encode, reset, lost).
- Real NFC reading happens in the app behind an interface; see docs/NEEDS-YOU.md for the device test.
