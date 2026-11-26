# Inspections (module 39)

HOD daily checkups. Spec: [docs/modules/39-inspections.md](../../docs/modules/39-inspections.md).

- **Routes** (`/api/inspections`): `GET|POST /checklists`, `PUT /checklists/:id`, `GET /today`, `GET|POST /runs`, `GET /runs/:id`, `POST /runs/:id/like`, `POST /runs/:id/comments`, `GET|PUT /settings`.
- The super admin (or anyone with `inspections.checklists.edit`) builds checklists per department, daily or weekly, with lines that need a photo when they fail and lines that raise a fault.
- A run scores passed lines out of checked ones. Failed lines that ask for it become faults in Faults & Maintenance (through its `FaultReporter` contract), with the photos.
- Concerned staff like and comment on runs; both have a super admin switch.
- **Permissions**: `inspections.runs.view|create|like|comment`, `inspections.checklists.edit`, `inspections.settings.edit`. Photos use purpose `inspections`.
