# Knowledge base (module 48)

Spec: [docs/modules/48-knowledge-base.md](../../docs/modules/48-knowledge-base.md).

SOPs & Knowledge Base (module 48): procedures, policies and how-to guides, with must-read articles.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `KB-0042`, QR text `IGG-REC:KB-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Article**: Title, Category, Text, Must read, Picture or document. Steps: Draft, Published, Archived.

## API

- **Routes** (`/api/knowledge`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `knowledge`: `records`, `record_events`, `settings`.
- **Permissions**: `knowledge-base.records.view|create|edit|approve|export|comment`, `knowledge-base.settings.edit`.
