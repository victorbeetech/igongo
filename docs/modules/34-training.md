# 34. Training & Certificates

**Group:** Staff · **Module key:** `training` · [All modules](README.md)

## Summary

Tracks training, skills and certificates, including food hygiene, first aid, lifeguard and fire safety.

## Features
- Training calendar with sessions, trainers and attendance by card tap.
- Short lessons and quizzes inside the app.
- Certificates with expiry dates and renewal reminders.
- Skills matrix per department.
- Mandatory training per role, with alerts if missing.
- Training records kept for inspections.

## Super admin options
- Training courses and which roles must take them.
- Certificate types and expiry rules.
- Who can schedule training.


## Depends on

- [HR Staff Records](22-hr-records.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `training.scheduled`
- `training.attended`
- `certificate.issued`
- `certificate.expiring`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
