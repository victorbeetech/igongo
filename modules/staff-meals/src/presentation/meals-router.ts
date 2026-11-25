/**
 * Staff Meals HTTP routes, mounted by the gateway at `/api/staff-meals`.
 *
 *   GET   /staff-meals/today         my meals today: had, open now, still to come (S32-01)
 *   POST  /staff-meals/serve         the canteen serves a meal (S32-02, S32-03)
 *   GET   /staff-meals/served?date   served list and counts in my scope (S32-04, S32-07)
 *   GET   /staff-meals/rules         meal times (S32-06)
 *   PUT   /staff-meals/rules         change them (S32-06)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, hotelDate, recordChange, requirePermission, scopeOf, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { MealsDeps } from "../application/meals-deps";
import { serveMeal } from "../application/use-cases/serve-meal";
import { mealServedAt } from "../domain/meal-rules";
import { MEAL_PERMISSIONS as P } from "./permissions";
import { dayQuery, rulesBody, serveBody } from "./request-schemas";

export function mealsRouter(deps: (c: Context<ActorEnv>) => MealsDeps) {
  return new Hono<ActorEnv>()
    .get("/today", async (c) => {
      const d = deps(c);
      const me = await d.staff.byUserId(actorOf(c).userId);
      if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
      const rules = await d.rules.read();
      const today = hotelDate(d.change.now);
      const had = new Map((await d.claims.list({ workDate: today, staffId: me.staffId })).map((cl) => [cl.mealKey, cl]));
      const open = mealServedAt(rules, d.change.now);
      return c.json({ date: today, meals: rules.meals.map((m) => ({ ...m, servedAt: had.get(m.key)?.at ?? null, openNow: open?.key === m.key })) });
    })
    .post("/serve", requirePermission(P.serve), zValidator("json", serveBody), async (c) => {
      // Serving other people needs a wide scope, not just "own".
      const scope = scopeOf(actorOf(c), P.serve);
      if (scope !== "all" && scope !== "location") throw new AppError("permission_denied", "This account cannot serve meals at the canteen.");
      const { uid, qr, staffId, mealKey } = c.req.valid("json");
      const scan = uid ? { uid } : qr ? { qr } : undefined;
      return c.json(await serveMeal(deps(c), { ...(scan ? { scan } : {}), ...(staffId ? { staffId } : {}), ...(mealKey ? { mealKey } : {}) }), 201);
    })
    .get("/served", zValidator("query", dayQuery), async (c) => {
      const d = deps(c);
      const actor = actorOf(c);
      const scope = staffScope(actor, P.view, await d.staff.byUserId(actor.userId));
      if (!scope) throw new AppError("permission_denied", `You need the permission ${P.view}.`);
      const date = c.req.valid("query").date ?? hotelDate(d.change.now);
      const claims = await d.claims.list({ workDate: date, ...(scope.kind === "department" ? { department: scope.department } : {}), ...(scope.kind === "own" ? { staffId: scope.staffId } : {}) });
      const people = new Map((await d.staff.byIds([...new Set(claims.map((cl) => cl.staffId))])).map((s) => [s.staffId, s]));
      // Counts per meal, for the canteen screen and forecast.
      const counts: Record<string, number> = {};
      for (const cl of claims) counts[cl.mealKey] = (counts[cl.mealKey] ?? 0) + 1;
      return c.json({ date, counts, items: claims.map((cl) => ({ ...cl, staff: people.get(cl.staffId) ?? null })) });
    })
    .get("/rules", async (c) => c.json(await deps(c).rules.read()))
    .put("/rules", requirePermission(P.rules), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "staff-meals", action: "meals.rules_changed", recordType: "settings", recordId: "rules", summary: `Changed staff meal times: ${rules.meals.map((m) => `${m.name} ${m.startsAt}-${m.endsAt}`).join(", ")}` });
      return c.json(rules);
    });
}
