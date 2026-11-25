/**
 * Gets a short-lived Google access token for FCM from the service-account
 * key, with the OAuth 2 "JWT bearer" flow, using only Web Crypto (no Node
 * libraries, so it runs on Cloudflare Workers).
 */

import { base64url, base64urlJson, pemToDer } from "./base64url";
import type { ServiceAccount } from "./service-account";

/** The only permission the token gets: sending FCM messages. */
const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

/** Tokens last an hour; renew five minutes early. */
const LIFETIME_SECONDS = 3600;
const RENEW_EARLY_MS = 5 * 60 * 1000;

/** Access tokens kept between requests in the same Worker, per key. */
const cache = new Map<string, { token: string; expiresAt: number }>();

/** Token requests in flight, so parallel sends share one sign-in. */
const pending = new Map<string, Promise<string>>();

/**
 * Returns an access token for [account], from the cache when still fresh.
 * Throws if Google refuses the key (for example after it was deleted).
 */
export async function googleAccessToken(account: ServiceAccount, fetcher: typeof fetch, now = Date.now()): Promise<string> {
  // 1. Reuse a fresh token.
  const cached = cache.get(account.client_email);
  if (cached && cached.expiresAt - RENEW_EARLY_MS > now) return cached.token;

  // 2. Join a sign-in that is already running, or start one.
  const running = pending.get(account.client_email);
  if (running) return running;
  const request = fetchAccessToken(account, fetcher, now).finally(() => pending.delete(account.client_email));
  pending.set(account.client_email, request);
  return request;
}

/** Signs a JWT, swaps it for an access token and caches it. */
async function fetchAccessToken(account: ServiceAccount, fetcher: typeof fetch, now: number): Promise<string> {
  // 1. Sign a JWT that asks for the FCM scope.
  const assertion = await signJwt(account, Math.floor(now / 1000));

  // 2. Swap it for an access token.
  const response = await fetcher(account.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error(`Google token request failed with ${response.status}`);
  const json = (await response.json()) as { access_token: string; expires_in?: number };

  // 3. Keep it for the next request.
  cache.set(account.client_email, {
    token: json.access_token,
    expiresAt: now + (json.expires_in ?? LIFETIME_SECONDS) * 1000,
  });
  return json.access_token;
}

/** Builds and signs (RS256) the JWT for [account], issued at [issuedAt] seconds. */
async function signJwt(account: ServiceAccount, issuedAt: number): Promise<string> {
  const header = base64urlJson({ alg: "RS256", typ: "JWT" });
  const claims = base64urlJson({
    iss: account.client_email,
    scope: FCM_SCOPE,
    aud: account.token_uri,
    iat: issuedAt,
    exp: issuedAt + LIFETIME_SECONDS,
  });
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claims}`));
  return `${header}.${claims}.${base64url(new Uint8Array(signature))}`;
}

/** Empties the cache. Tests only. */
export function clearAccessTokenCache(): void {
  cache.clear();
  pending.clear();
}
