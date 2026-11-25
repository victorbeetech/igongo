# Cloudflare deploy bridge

Cloud sessions can push to GitHub but cannot reach `api.cloudflare.com`,
and the Cloudflare connector cannot fetch from outside hosts. This bridge
moves a built file from GitHub into Cloudflare so the connector can deploy it.

**From your own computer you never need this:** run
`pnpm --filter @igongo/api deploy` after `npx wrangler login`.

## Steps (cloud session)

1. Build: `pnpm --filter @igongo/api build` (writes `apps/api/dist/index.js`).
2. Push `dist/index.js` to the work branch under `tools/cf-deploy-bridge/staging/` (the repo is public, the bundle holds no secrets). For the web, pack `apps/web/out` into one JSON (`{manifest, files: {hash: {b64, type}}, headers}`) and push that too; the bridge then uploads the asset buckets with the upload-session token (job kind `assets`).
3. With the connector: create a KV namespace, upload `bridge-worker.js` as a Worker with that KV bound as `BRIDGE` and a `* * * * *` cron, and put the job in KV key `job`.
4. Wait for the job to show `done: true` (the first cron run can take a few minutes).
5. With the connector: read the bundle from KV and `PUT /workers/scripts/igongo-api` as a module with the bindings from `apps/api/wrangler.jsonc`.
6. Delete the bridge Worker, its KV namespace, and the staged file from the branch.

Secrets are set with `PUT /workers/scripts/igongo-api/secrets`, generated
inside the connector where they are random (never shown or committed).
