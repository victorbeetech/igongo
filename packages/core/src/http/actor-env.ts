/**
 * The Hono environment every module router uses: the gateway puts the
 * signed-in caller on `c.var.actor` (undefined when nobody is signed in) and
 * the request ID on `c.var.requestId`. Modules trust only these, never IDs
 * sent in a request body.
 */

import type { Actor } from "@igongo/contracts/users-login";

/** Hono context variables set by the API shell. */
export interface ActorVariables {
  actor: Actor | undefined;
  requestId: string;
}

/** The Hono `Env` type for module routers. */
export type ActorEnv = { Variables: ActorVariables };
