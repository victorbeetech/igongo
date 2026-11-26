/**
 * Where a request comes from: the staff web portal or the Igongo app. The
 * web portal is for staff and the super admin only, so the server needs to
 * know. Pure function over the request's headers.
 *
 * - A browser on the staff host sends its `Origin` (or uses the cookie).
 * - Google and Apple redirects (`/callback/...`) only happen on the web.
 * - The app sends `Authorization: Bearer` and no web origin.
 */

export type RequestSurface = "web" | "app";

export function surfaceOf(headers: Headers | undefined, webOrigins: string[], authPath?: string): RequestSurface {
  if (authPath?.startsWith("/callback/")) return "web";
  const origin = headers?.get("origin");
  if (origin && webOrigins.includes(origin)) return "web";
  if (headers?.get("authorization")?.startsWith("Bearer ")) return "app";
  // A session cookie only ever comes from a browser.
  return headers?.get("cookie")?.includes("session_token") ? "web" : "app";
}
