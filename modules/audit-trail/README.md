# Audit Trail API (module 5)

The API side of the [Audit Trail](../../docs/modules/05-audit-trail.md): a permanent, tamper-evident record of every action, searchable years back.

## How it stays tamper-evident

- Rows live in the `audit.events` table, which **refuses UPDATE, DELETE and TRUNCATE** (database triggers, migration `0001`).
- On insert, a trigger takes a lock, gives the row the next `seq`, copies the previous row's hash into `prev_hash`, and stores `hash = sha256(audit.entry_text(row))`. Code cannot choose these values.
- `GET /api/audit/verify` recomputes every hash with the same SQL function and checks each link. Anyone who edits a row around the triggers is found.
- Values of fields that look secret (password, token, key, code, PIN) are masked before they are stored.

## Routes (mounted at `/api/audit`)

| Route | Permission | What |
| --- | --- | --- |
| `GET /entries` | `audit-trail.entries.view` | Search by person, module, action, record, time range and words; newest first, 50 a page (`beforeSeq` for the next page) |
| `GET /verify` | `audit-trail.chain.view` | Check the hash chain (`fromSeq`, `limit`) |

Other modules record through the `AuditRecorder` contract (`packages/contracts/audit-trail`); the gateway gives it to them. A failed record makes the request fail, and the request's transaction rolls the change back.
