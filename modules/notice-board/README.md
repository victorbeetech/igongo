# Notice Board (module 49)

Company posts and announcements. Spec: [docs/modules/49-notice-board.md](../../docs/modules/49-notice-board.md).

- **Routes** (`/api/notices`): `GET /`, `POST /`, `GET|PUT /settings`, `GET /:id` (marks read), `PATCH /:id`, `DELETE /:id`, `POST /:id/like`, `POST /:id/comments`, `GET /:id/reads`.
- Posts go to all staff or chosen roles. Likes and comments can be switched off board-wide (super admin) and per post. New posts are pushed through Notifications (sends nothing until Firebase has keys).
- **Permissions**: `notice-board.posts.view|create|edit|delete|like|comment`, `notice-board.settings.edit`. Authors can always edit and remove their own posts.
