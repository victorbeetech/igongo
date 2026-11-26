# Onboarding and exit (module 24)

Spec: [docs/modules/24-onboarding-exit.md](../../docs/modules/24-onboarding-exit.md).

Onboarding & Exit (module 24): first-days checklists for new staff, exit checklists, handovers and exit interviews.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `OB-0042`, QR text `IGG-REC:OB-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Onboarding**: New staff member, Start date, Card issued, Uniform given, Induction done, App account made, Notes. Steps: Started, Ready, Cancelled.
- **Exit**: Leaving staff member, Last day, Reason, Card returned, Keys returned, Uniform returned, Final pay checked, Exit interview notes. Steps: Started, Cleared, Left, Cancelled.

## API

- **Routes** (`/api/onboarding`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `onboarding`: `records`, `record_events`, `settings`.
- **Permissions**: `onboarding-exit.records.view|create|edit|approve|export|comment`, `onboarding-exit.settings.edit`.
