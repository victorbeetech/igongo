# S22. HR Staff Records

[All screens](README.md) · [Module spec](../../modules/22-hr-records.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s22-01"></a>S22-01 | Staff directory | App, Web | `/hr-records/staff-directory` | Everyone with photo, role, department and contact, by permission | Role home | S22-02 Staff profile, S22-03 Add staff, S22-07 Expiring documents, S22-09 HR records settings |
| <a id="s22-02"></a>S22-02 | Staff profile | App, Web | `/hr-records/staff-profile/:id` | One person's record: personal, job, pay, documents, cards and history | Role home, S22-01 Staff directory, [S16-15 Who owns this card](16-staff-cards.md#s16-15) | S22-04 Edit staff, S22-05 Staff documents, S22-06 Job history, [S16-09 Card detail](16-staff-cards.md#s16-09) |
| <a id="s22-03"></a>S22-03 | Add staff | Web | `/hr-records/add-staff` | Personal details, job, pay, next of kin, documents and photo | S22-01 Staff directory | [D24-01 Start onboarding](24-onboarding-exit.md#d24-01) |
| <a id="s22-04"></a>S22-04 | Edit staff | Web | `/hr-records/edit-staff` | Change any field, with the reason kept in history | S22-02 Staff profile | D22-02 Confirm pay change |
| <a id="s22-05"></a>S22-05 | Staff documents | App, Web | `/hr-records/staff-documents` | IDs, contracts, certificates and expiry dates | S22-02 Staff profile | Back only |
| <a id="s22-06"></a>S22-06 | Job history | App, Web | `/hr-records/job-history` | Roles, departments, pay changes and promotions over time | S22-02 Staff profile | Back only |
| <a id="s22-07"></a>S22-07 | Expiring documents | Web | `/hr-records/expiring-documents` | IDs, permits and contracts about to expire | Role home, S22-01 Staff directory | Back only |
| <a id="s22-08"></a>S22-08 | My profile at work | App | `/hr-records/my-profile-at-work/:id` | What HR holds about me, with change requests | Role home | D22-01 Change request |
| <a id="s22-09"></a>S22-09 | HR records settings | Web | `/hr-records/hr-records-settings` | Required fields per employment type, and extra fields through [Custom Fields](07-custom-fields.md); Staff number format; Which fields staff can update... | S22-01 Staff directory | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d22-01"></a>D22-01 | Change request | Ask HR to correct my details | S22-08 My profile at work |
| <a id="d22-02"></a>D22-02 | Confirm pay change | Approve a salary change with effective date | S22-04 Edit staff |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
