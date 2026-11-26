# Records Archive & Search (module 06)

"Who did X two years ago?" Spec: [docs/modules/06-records-search.md](../../docs/modules/06-records-search.md).

- **Routes** (`/api/records`): `GET /search` (words, person, module, action, dates, paging), `GET /history/:recordType/:id`, `GET /export.csv`.
- No tables of its own: every module records each change in the Audit Trail (append-only, hash-chained, never deleted), and this module searches it through the `AuditReader` contract. Exports are themselves recorded.
- **Permissions**: `records-search.records.view`, `records-search.records.export` (scope wider than own).
