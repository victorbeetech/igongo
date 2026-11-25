/**
 * Deploy bridge: a tiny temporary Worker that lets a cloud session (which
 * can reach GitHub but not api.cloudflare.com) hand built files to the
 * Cloudflare connector.
 *
 * How it is used (see tools/cf-deploy-bridge/README.md):
 *  1. The built bundle is pushed to a branch of the public repo.
 *  2. The connector writes a job to KV key `job`. Two kinds:
 *       { "files": [ { "url": "https://raw.githubusercontent.com/...", "key": "bundle" } ] }
 *         fetches each file into KV under its key.
 *       { "assets": { "account": "...", "pack": "web", "jwt": "<upload session token>", "buckets": [[hash, ...], ...] } }
 *         uploads static-asset buckets from a packed JSON in KV (made by
 *         pack-assets.mjs) with the upload session token, which the
 *         connector cannot send itself.
 *  3. This Worker's one-minute cron does the job and marks it done.
 *  4. The connector reads the result from KV and deploys.
 *  5. The bridge Worker, its KV namespace and the pushed files are deleted.
 *
 * It holds no long-lived tokens and can only write to its own KV namespace.
 */

export default {
  async scheduled(_event, env) {
    // Step 1: read the job; nothing to do when none is waiting.
    const job = await env.BRIDGE.get("job", "json");
    if (!job || job.done) return;
    try {
      // Step 2a: copy files from GitHub into KV.
      for (const file of job.files ?? []) {
        const res = await fetch(file.url, { headers: { "cache-control": "no-cache" } });
        if (!res.ok) throw new Error(`Fetch ${file.url} failed: ${res.status}`);
        await env.BRIDGE.put(file.key, await res.text());
      }
      // Step 2b: upload static-asset buckets; the last reply holds the completion token.
      let completion = null;
      if (job.assets) {
        const pack = await env.BRIDGE.get(job.assets.pack, "json");
        for (const bucket of job.assets.buckets) {
          const form = new FormData();
          for (const hash of bucket) form.append(hash, new File([pack.files[hash].b64], hash, { type: pack.files[hash].type }));
          const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${job.assets.account}/workers/assets/upload?base64=true`, {
            method: "POST", headers: { authorization: `Bearer ${job.assets.jwt}` }, body: form,
          });
          const body = await res.json();
          if (!res.ok || !body.success) throw new Error(`Upload failed: ${res.status} ${JSON.stringify(body.errors)}`);
          if (body.result?.jwt) completion = body.result.jwt;
        }
      }
      // Step 3: mark the job done.
      await env.BRIDGE.put("job", JSON.stringify({ ...job, assets: job.assets ? { ...job.assets, jwt: null } : undefined, completion, done: true, at: new Date().toISOString() }));
    } catch (err) {
      // Record the failure so the connector can see it, and stop retrying.
      await env.BRIDGE.put("job", JSON.stringify({ ...job, assets: undefined, done: true, error: String(err), at: new Date().toISOString() }));
    }
  },
};
