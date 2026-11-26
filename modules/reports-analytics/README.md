# Reports & Analytics (module 81)

The management dashboard. Spec: [docs/modules/81-reports-analytics.md](../../docs/modules/81-reports-analytics.md).

- **Routes** (`/api/reports`): `GET /dashboard?from&to`, `GET /dashboard/export.csv`, `GET|PUT /settings`, `GET /catalogue`.
- Each module gives the gateway a `KpiSource` (contract `reports-analytics`); the gateway leaves out switched-off modules. A source that fails shows as "could not load" and the rest of the dashboard still works.
- Scope `all` on `reports-analytics.dashboard.view` sees every module; otherwise only modules whose `<module>.reports.view` the viewer holds wider than `own` (an HOD sees their own areas).
- **Settings** (super admin): hide tiles, and the range the dashboard opens on (today, 7 or 30 days).
