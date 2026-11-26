# Chat (module 50)

Staff chat and guest chat with the hotel. Spec: [docs/modules/50-chat.md](../../docs/modules/50-chat.md).

- **Routes** (`/api/chat`): `GET|POST /conversations`, `GET /desks`, `POST /desks/:key`, `GET|POST /conversations/:id/messages`, `POST /conversations/:id/read`, `GET /people`, `GET|PUT /settings`.
- **Kinds**: direct (two staff, reused), group (staff), desk (a guest and a hotel desk such as the front desk; holders of the desk's roles answer, and join on their first reply).
- Messages are kept for ever. Unread counts come from each person's read marker. Clients poll with `after`; live push comes with the realtime service.
- **Settings** (super admin): staff chat, groups, guest chat, desks and their roles, attachments, largest group.
