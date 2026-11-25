# Super Admin Console API (module 1)

The API side of the [Super Admin Console](../../docs/modules/01-super-admin.md).

| Route (under `/api`) | Permission | What |
| --- | --- | --- |
| `GET /admin/modules`, `PATCH /admin/modules/:key` | `super-admin.modules.view` / `.edit` | All 84 modules with on, off and maintenance. Core modules can't be switched off. The gateway refuses calls to a switched-off module. |
| `GET /admin/settings`, `PATCH /admin/settings/:section` | `super-admin.settings.view` / `.edit` | Hotel profile, branding (logo, global banner, minimum app version) and regional formats, checked by Zod |
| `GET /admin/keys`, `PUT/DELETE /admin/keys/:key` | `super-admin.keys.view` / `.edit` / `.delete` | Integration and gateway keys (`provider.field`), stored with AES-256-GCM. Values never come back out; only the last four characters show. |
| `GET /public/settings` | anyone | Hotel and branding, for the login screen |

The master key is the Worker secret `SETTINGS_ENCRYPTION_KEY` (32 random bytes, base64). Server code reads keys through the `SecretReader` contract; for example Apple sign-in reads `apple.team_id`, `apple.key_id`, `apple.client_id` and `apple.private_key`, and switches itself on when all four are saved.
