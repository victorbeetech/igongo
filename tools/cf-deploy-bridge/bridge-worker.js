/**
 * Deploy bridge: a tiny temporary Worker that lets a cloud session (which
 * can reach GitHub but not api.cloudflare.com) hand a built file to the
 * Cloudflare connector.
 *
 * How it is used (see tools/cf-deploy-bridge/README.md):
 *  1. The built bundle is pushed to a branch of the public repo.
 *  2. The connector writes a job to KV key `job`:
 *       { "files": [ { "url": "https://raw.githubusercontent.com/...", "key": "bundle" } ] }
 *  3. This Worker's one-minute cron fetches each file into KV under its key.
 *  4. The connector reads the file from KV and uploads the Worker script.
 *  5. The bridge Worker, its KV namespace and the pushed file are deleted.
 *
 * It holds no tokens and can only write to its own KV namespace.
 */

export default {
  async scheduled(_event, env) {
    const job = await env.BRIDGE.get("job", "json");
    if (!job || job.done) return;
    for (const file of job.files) {
      const res = await fetch(file.url, { headers: { "cache-control": "no-cache" } });
      if (!res.ok) throw new Error(`Fetch ${file.url} failed: ${res.status}`);
      await env.BRIDGE.put(file.key, await res.text());
    }
    await env.BRIDGE.put("job", JSON.stringify({ ...job, done: true, at: new Date().toISOString() }));
  },
};
