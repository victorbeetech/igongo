/**
 * Gives every request an ID: Cloudflare's Ray ID when there is one, else a
 * new random one. It is sent back in `x-request-id`, put in every log line
 * and error reply, and tagged in Sentry, so a user's screenshot of an error
 * leads straight to the logs.
 */

import type { MiddlewareHandler } from "hono";
import type { ApiEnv } from "./api-env";

export const requestId: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const id = c.req.header("cf-ray") ?? crypto.randomUUID();
  c.set("requestId", id);
  c.header("x-request-id", id);
  await next();
};
