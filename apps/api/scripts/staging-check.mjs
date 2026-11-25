// Staging check: signs in against the LIVE API the way the web portal does,
// then cleans up. Run by .github/workflows/staging-check.yml after each
// merge and every morning, or by hand: `pnpm --filter @igongo/api staging-check`.
//
// Steps: health is ok -> the login screen's methods load -> a throwaway
// guest signs up -> signs in -> reads its own access -> lists its sessions
// -> signs out -> deletes its account. Any failure exits with code 1.

const API = process.env.API_URL ?? "https://igongo-api.victorbee.com";
const ORIGIN = process.env.WEB_ORIGIN ?? "https://igongo.victorbee.com";
let cookie = "";

/** One call, keeping the session cookie like a browser. */
async function call(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { origin: ORIGIN, "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const set = res.headers.getSetCookie?.() ?? [];
  if (set.length) cookie = set.map((c) => c.split(";")[0]).join("; ");
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : {} };
}

/** Fails the check with [message] unless [ok]. */
function expect(ok, message, detail) {
  if (!ok) {
    process.stderr.write(`FAIL: ${message} ${JSON.stringify(detail ?? "")}\n`);
    process.exit(1);
  }
  process.stdout.write(`ok: ${message}\n`);
}

const email = `staging-check-${Date.now()}@example.com`;
const password = `Check-${crypto.randomUUID()}`;
const health = await call("GET", "/health");
expect(health.status === 200 && health.data.database === "ok", "health and database", health.data);
const methods = await call("GET", "/api/login-methods");
expect(methods.data.methods?.some((m) => m.method === "email_password"), "email sign-in is offered", methods.data);
expect((await call("POST", "/api/auth/sign-up/email", { name: "Staging Check", email, password })).status === 200, "sign up a throwaway guest");
cookie = "";
const signIn = await call("POST", "/api/auth/sign-in/email", { email, password });
expect(signIn.status === 200, "sign in with email and password", signIn.data);
const me = await call("GET", "/api/access/me");
expect(me.status === 200 && me.data.roles?.some((r) => r.key === "guest"), "my access has the guest role", me.data);
const sessions = await call("GET", "/api/users/me/sessions");
expect(sessions.data.items?.some((s) => s.current), "my session is listed", sessions.data);
expect((await call("POST", "/api/auth/delete-user", {})).status === 200, "delete the throwaway account");
