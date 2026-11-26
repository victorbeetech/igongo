# Surveys and polls (module 52)

Spec: [docs/modules/52-surveys-polls.md](../../docs/modules/52-surveys-polls.md).

Surveys & Polls (module 52): each survey is a record type whose questions are its fields; answers are records, and results are counted from them.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `SV-0042`, QR text `IGG-REC:SV-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Staff satisfaction survey**: How happy are you at work?, What do you like most?, What should we change?. Steps: Answered. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/surveys`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `surveys`: `records`, `record_events`, `settings`.
- **Permissions**: `surveys-polls.records.view|create|edit|approve|export|comment`, `surveys-polls.settings.edit`.
