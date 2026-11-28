/**
 * Guest content HTTP routes, mounted by the gateway at `/api/content`. Paths here are relative to it.
 *
 *   GET /api/content          the switched-on content the guest app shows (public)
 *   GET /api/content/all      the whole document, every switch, for the super admin
 *   PUT /api/content          save the whole document (super admin)
 */

import { zValidator } from "@hono/zod-validator";
import { requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { GuestContentDeps } from "../application/guest-content-deps";
import { readActiveContent, readFullContent } from "../application/use-cases/read-content";
import { saveContent } from "../application/use-cases/save-content";
import { GUEST_CONTENT_PERMISSIONS as P } from "./permissions";
import { contentBody } from "./request-schemas";

/** Builds the router. [deps] is called per request so each request gets its own database connection. */
export function guestContentRouter(deps: (c: Context<ActorEnv>) => GuestContentDeps) {
  return new Hono<ActorEnv>()
    // Public: the guest app reads this before sign-in, so it returns only switched-on items.
    .get("/", async (c) => c.json(await readActiveContent(deps(c))))
    // Staff with view permission see every item and its switch.
    .get("/all", requireStaffPermission(P.view), async (c) => c.json(await readFullContent(deps(c))))
    // Saving replaces the whole document, so the admin screen always sends the full list.
    .put("/", requireStaffPermission(P.edit), zValidator("json", contentBody), async (c) =>
      c.json(await saveContent(deps(c), c.req.valid("json"))),
    );
}
