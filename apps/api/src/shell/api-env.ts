/** The Hono environment of the API Worker: the shell's variables on every request. */

import type { ActorVariables, Database } from "@igongo/core";
import type { RequestServices } from "../wiring/request-services";
import type { Env } from "./env";

export interface ApiVariables extends ActorVariables {
  /** This request's database (a transaction for changing requests). */
  db: Database;
  /** The modules' stores and services, built on first use. */
  services: RequestServices;
}

export type ApiEnv = { Bindings: Env; Variables: ApiVariables };
