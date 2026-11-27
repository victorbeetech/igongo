/**
 * Login method switches, mounted by the gateway at `/api/login-methods`.
 *
 *   GET   /           the switched-on methods, for the login screen (public);
 *                     Google and Apple only when their keys are set up
 *   GET   /admin      every method with its switch, roles and order, and the policy
 *   PATCH /policy     change the login policy (self sign-up, approval, session days)
 *   PATCH /:method    switch a method on or off, limit it to roles, reorder
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { recordChange, requirePermission, type ActorEnv } from "@igongo/core";
import { publicMethods, updateLoginMethod } from "../application/use-cases/login-methods";
import { METHOD_INFO } from "../domain/login-method-setting";
import { USER_PERMISSIONS as P } from "./permissions";
import { methodBody, methodParam, policyBody } from "./request-schemas";
import type { UsersDeps } from "./users-deps";

export function loginMethodsRouter(deps: (c: Context<ActorEnv>) => UsersDeps) {
  return new Hono<ActorEnv>()
    .get("/", async (c) => {
      const d = deps(c);
      // Ask the server which social providers have keys; none asked means both ready.
      const ready = d.socialReady ? await d.socialReady() : undefined;
      return c.json(await publicMethods(d.settings, ready));
    })
    .get("/admin", requirePermission(P.viewMethods), async (c) => {
      const s = deps(c).settings;
      const methods = (await s.methods()).map((m) => ({ ...m, ...METHOD_INFO[m.method] }));
      return c.json({ methods, policy: await s.policy() });
    })
    .patch("/policy", requirePermission(P.editMethods), zValidator("json", policyBody), async (c) => {
      const d = deps(c);
      const patch = Object.fromEntries(Object.entries(c.req.valid("json")).filter(([, v]) => v !== undefined));
      const before = await d.settings.policy();
      await d.settings.savePolicy(patch);
      await recordChange(d.change, {
        action: "login_policy.updated",
        module: "users-login",
        summary: "Changed the login rules",
        changes: Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, { old: before[k as keyof typeof before], new: v }])),
      });
      return c.json(await d.settings.policy());
    })
    .patch("/:method", requirePermission(P.editMethods), zValidator("param", methodParam), zValidator("json", methodBody), async (c) => {
      const patch = Object.fromEntries(Object.entries(c.req.valid("json")).filter(([, v]) => v !== undefined));
      return c.json(await updateLoginMethod(deps(c).settings, deps(c).change, c.req.valid("param").method, patch));
    });
}
