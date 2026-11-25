/**
 * CORS: only the Igongo web portal (and localhost for development) may call
 * the API from a browser, with cookies. The app does not need CORS.
 */

import { cors } from "hono/cors";

/** CORS for the given allowed origins. */
export function corsFor(origins: string[]) {
  return cors({
    origin: (origin) => (origins.includes(origin) ? origin : null),
    credentials: true,
    allowHeaders: ["content-type", "authorization", "x-otp-channel"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["x-request-id", "set-auth-token"],
    maxAge: 600,
  });
}
