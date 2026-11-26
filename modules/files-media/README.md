# Files & Media (module 11)

Photos and documents for every module. Spec: [docs/modules/11-files-media.md](../../docs/modules/11-files-media.md).

- **Routes** (`/api/files`): `POST /` (JSON `{name, type, data: base64, purpose}`), `GET|PUT /settings`, `GET /:id` (the bytes), `GET /:id/info`, `DELETE /:id`.
- Bytes live in the Cloudflare R2 bucket bound as `FILES`; records in the `files` schema. Removed files stay recorded.
- **Who may upload or see**: the uploader; holders of `files-media.files.create|view`; and anyone holding `<purpose>.photos.create|view`, such as `faults-maintenance.photos.create`, so each module's own permissions decide.
- **Settings** (`files-media.settings.edit`): largest file in MB and allowed types.
