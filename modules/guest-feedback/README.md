# Feedback and complaints (module 56)

Spec: [docs/modules/56-guest-feedback.md](../../docs/modules/56-guest-feedback.md).

Feedback, Complaints & Reviews (module 56): feedback after every service, complaints handled to the end, and online reviews.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `FB-0042`, QR text `IGG-REC:FB-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Feedback**: About, Stars (1 to 5), Comment. Steps: Received, Read. Self-service (staff or guests raise their own).
- **Complaint**: About, What went wrong, Phone, What we did. Steps: Received, Investigating, Resolved, Closed. Self-service (staff or guests raise their own).
- **Online review**: Site, Stars, Review, Our reply. Steps: New, Replied.

## API

- **Routes** (`/api/feedback`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `feedback`: `records`, `record_events`, `settings`.
- **Permissions**: `guest-feedback.records.view|create|edit|approve|export|comment`, `guest-feedback.settings.edit`.
