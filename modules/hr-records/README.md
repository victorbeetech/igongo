# HR Records (module 22)

The staff directory and each staff member's profile at work. Spec: [docs/modules/22-hr-records.md](../../docs/modules/22-hr-records.md).

- **Routes** (`/api/hr`): `GET /staff/me`, `GET /staff` (scoped search), `POST /staff` (enrol: next `IGG-0001` number, links the account and gives it the `staff-base` role), `GET /staff/:id`, `PATCH /staff/:id`.
- **Contract for other modules**: `StaffDirectory` in `packages/contracts/hr-records` (by user, by ID, active staff per department). Attendance, cards, meals and reports use only this.
- **Schema** `hr`: `staff`. People who leave are marked `left`, never deleted.
- **Permissions**: `hr-records.staff.view` (scope all, department or own), `.create`, `.edit`. Departments are free text until Locations & Departments (15) is built.
