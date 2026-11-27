/**
 * CRM HTTP routes, mounted by the gateway at `/api/crm`.
 *
 *   GET    /crm/me                 my profile (S54-05), made on first use
 *   PATCH  /crm/me                 change my details: name, phone, email, likes, allergies (S54-06)
 *   PUT    /crm/me/consent         my marketing choices (S54-07)
 *   GET    /crm/guests?q&tag       guests list (S54-01), staff
 *   POST   /crm/guests             add a walk-in guest, staff
 *   GET    /crm/guests/:id         one guest with staff notes (S54-02)
 *   PUT    /crm/guests/:id/tags    set tags
 *   POST   /crm/guests/:id/notes   add a staff note
 *   GET|PUT /crm/settings          the tag list (S54-08)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, recordChange, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { CrmDeps } from "../application/crm-deps";
import { myProfile, setMyConsent, updateMyProfile } from "../application/use-cases/my-profile";
import { addStaffNote, createWalkIn, tagGuest } from "../application/use-cases/staff-guest-tools";
import { checkedJson } from "./checked-json";
import { CRM_PERMISSIONS as P } from "./permissions";
import { consentBody, myDetailsBody, noteBody, searchQuery, settingsBody, tagsBody, walkInBody } from "./request-schemas";

export function crmRouter(deps: (c: Context<ActorEnv>) => CrmDeps) {
  return new Hono<ActorEnv>()
    .get("/me", requireSignIn, async (c) => c.json(await myProfile(deps(c), actorOf(c))))
    .patch("/me", requireSignIn, checkedJson(myDetailsBody), async (c) => c.json(await updateMyProfile(deps(c), actorOf(c), c.req.valid("json"))))
    .put("/me/consent", requireSignIn, checkedJson(consentBody), async (c) => c.json(await setMyConsent(deps(c), actorOf(c), c.req.valid("json"))))
    .get("/guests", requireStaffPermission(P.view), zValidator("query", searchQuery), async (c) => {
      const { q, tag } = c.req.valid("query");
      return c.json({ items: await deps(c).profiles.search({ ...(q ? { q } : {}), ...(tag ? { tag } : {}), limit: 100 }) });
    })
    .post("/guests", requireStaffPermission(P.create), zValidator("json", walkInBody), async (c) => {
      const { name, phone, email } = c.req.valid("json");
      return c.json(await createWalkIn(deps(c), { name, ...(phone ? { phone } : {}), ...(email ? { email } : {}) }), 201);
    })
    .get("/guests/:id", requireStaffPermission(P.view), async (c) => {
      const d = deps(c);
      const profile = await d.profiles.byId(c.req.param("id"));
      if (!profile) throw new AppError("not_found", "Guest not found.");
      return c.json({ ...profile, notes: await d.profiles.notes(profile.id) });
    })
    .put("/guests/:id/tags", requireStaffPermission(P.edit), zValidator("json", tagsBody), async (c) => {
      return c.json(await tagGuest(deps(c), c.req.param("id"), c.req.valid("json").tags));
    })
    .post("/guests/:id/notes", requireStaffPermission(P.edit), zValidator("json", noteBody), async (c) => {
      return c.json(await addStaffNote(deps(c), c.req.param("id"), c.req.valid("json").text), 201);
    })
    .get("/settings", requireSignIn, async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const value = c.req.valid("json");
      await d.settings.write(value, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "crm-guests", action: "crm.settings_changed", recordType: "settings", recordId: "crm", summary: `Changed guest tags: ${value.tags.join(", ")}` });
      return c.json(value);
    });
}
