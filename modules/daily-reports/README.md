# Daily Reports (module 38)

Each staff member's end-of-day report. Spec: [docs/modules/38-daily-reports.md](../../docs/modules/38-daily-reports.md).

- **Routes** (`/api/daily-reports`): `GET|PUT /template`, `GET /mine`, `PUT /mine/:date` (save or send), `GET /` (scoped), `GET /missing`, `GET /:id`, `POST /:id/review` (sign or return), `POST /:id/comments`.
- One report per person per day; drafts are private; sent reports are locked until returned. Nobody signs their own report.
- **Permissions**: `daily-reports.reports.create|view|approve|comment` (scope decides whose), `daily-reports.templates.edit`.
