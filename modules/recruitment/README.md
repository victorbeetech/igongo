# Recruitment (module 23)

Spec: [docs/modules/23-recruitment.md](../../docs/modules/23-recruitment.md).

Recruitment (module 23): vacancies, applications from the jobs page, interviews and scores, up to an accepted offer.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `RC-0042`, QR text `IGG-REC:RC-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Vacancy**: Job title, Department, Openings, Closing date, Description. Steps: Requested, Approved, Open, Closed.
- **Application**: Job, Name, Phone, Email, CV or photo of it, About me. Steps: Applied, Shortlisted, Interview, Offered, Hired, Not taken. Self-service (staff or guests raise their own).
- **Interview**: Applicant, Date, Time, Panel, Score (out of 100), Notes. Steps: Planned, Scored, Cancelled.

## API

- **Routes** (`/api/recruitment`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `recruitment`: `records`, `record_events`, `settings`.
- **Permissions**: `recruitment.records.view|create|edit|approve|export|comment`, `recruitment.settings.edit`.
