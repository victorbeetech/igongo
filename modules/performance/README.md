# Performance (module 33)

Spec: [docs/modules/33-performance.md](../../docs/modules/33-performance.md).

Performance & Appraisals (module 33): appraisals by cycle, goals and probation reviews.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `PF-0042`, QR text `IGG-REC:PF-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Appraisal**: Staff member, Cycle, Score (out of 5), Strengths, To improve, Staff comments. Steps: Draft, Self review, Manager review, Agreed, Closed.
- **Goal**: Staff member, Goal, How it is measured, Progress (%). Steps: Set, On track, At risk, Met, Missed.
- **Probation review**: Staff member, Probation ends, Outcome, Notes. Steps: Due, Reviewed, Closed.

## API

- **Routes** (`/api/performance`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `performance`: `records`, `record_events`, `settings`.
- **Permissions**: `performance.records.view|create|edit|approve|export|comment`, `performance.settings.edit`.
