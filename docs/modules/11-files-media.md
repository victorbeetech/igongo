# 11. Files & Media

**Group:** Core platform · **Module key:** `files-media` · [All modules](README.md)

## Summary

Stores every photo, document, video and voice note in the system on Cloudflare R2, with access control and links to the records they belong to.

## Features
- Upload from camera, gallery or computer, with automatic image compression.
- Photo annotation: draw circles and arrows on a fault photo.
- Folders per module and record, and shared folders for departments.
- Access follows the record's permissions; private files use short-lived links.
- Version history for documents.
- Expiry dates on documents, with reminders (for example a staff medical certificate).
- Virus scan on upload.
- Watermark sensitive documents with the viewer's name.

## Super admin options
- Maximum file size and allowed file types per module.
- Storage quota per module and alerts when near.
- How long files are kept, per module.
- Whether downloads are allowed or view-only, per role.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `file.uploaded`
- `file.deleted`
- `file.expiring`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
