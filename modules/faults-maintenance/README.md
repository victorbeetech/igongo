# Faults & Maintenance (module 40)

Fault reports with photos, likes and comments, and the work to fix them. Spec: [docs/modules/40-faults-maintenance.md](../../docs/modules/40-faults-maintenance.md).

- **Routes** (`/api/faults`): `GET /`, `POST /`, `GET /summary`, `GET|PUT /settings`, `GET /:id`, `POST /:id/assign`, `POST /:id/status`, `POST /:id/like`, `POST /:id/comments`.
- **Life**: open, assigned, in progress, on hold, fixed (with what was done), closed by the reporter or an approver; fixed or closed faults can be reopened. Every step is in the fault's history and the Audit Trail.
- **Who sees what**: the scope on `faults-maintenance.faults.view` (all, department, own). Reporters and assignees always see theirs.
- **Photos**: uploaded to Files & Media with purpose `faults-maintenance`; anyone who may report a fault may upload them.
- **Settings** (`faults-maintenance.settings.edit`): categories (each sends its faults to a department), likes, comments, photo required.
- **Contract**: `FaultReporter` lets Inspections raise a fault when a check fails.
