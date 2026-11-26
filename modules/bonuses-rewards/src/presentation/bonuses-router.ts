/**
 * Bonuses & Rewards HTTP routes, mounted by the gateway at `/api/bonuses`.
 *
 *   GET   /bonuses/mine            my bonuses and buffet passes            S31-04
 *   GET   /bonuses                 bonuses in my scope (staff tool)        S31-02
 *   POST  /bonuses                 award one                               S31-01
 *   POST  /bonuses/:id/decide      approve or decline                      S31-02
 *   POST  /bonuses/buffet/redeem   use a pass at the buffet (card tap)     S31-03
 *   GET   /bonuses/settings        the rules                               S31-05
 *   PUT   /bonuses/settings        change them                             S31-05
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, hotelDate, recordChange, requirePermission, requireStaffPermission, scopeReaches, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { BonusesDeps } from "../application/bonuses-deps";
import { awardBonus, decideBonus } from "../application/use-cases/award-bonus";
import { redeemBuffet } from "../application/use-cases/redeem-buffet";
import { hasPassFor } from "../domain/bonus";
import { BONUS_PERMISSIONS as P } from "./permissions";
import { awardBody, decideBody, listQuery, redeemBody, rulesBody } from "./request-schemas";

export function bonusesRouter(deps: (c: Context<ActorEnv>) => BonusesDeps) {
  /** The caller's scope for [permission], wider than own. @throws AppError `permission_denied` */
  async function wideScope(c: Context<ActorEnv>, permission: string) {
    const d = deps(c);
    const self = await d.staff.byUserId(actorOf(c).userId);
    const scope = staffScope(actorOf(c), permission, self);
    if (!scope || scope.kind === "own") throw new AppError("permission_denied", `You need the permission ${permission}.`);
    return { scope, self };
  }

  return new Hono<ActorEnv>()
    .get("/mine", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const me = await d.staff.byUserId(actorOf(c).userId);
      if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
      const items = await d.bonuses.list({ staffId: me.staffId, limit: 500 });
      const today = hotelDate(d.change.now);
      // Passes left today, for the big number on the app's screen.
      const passesLeft = items.filter((b) => hasPassFor(b, today)).reduce((n, b) => n + b.passes - b.passesUsed, 0);
      return c.json({ items, passesLeft });
    })
    .get("/", requireStaffPermission(P.view), zValidator("query", listQuery), async (c) => {
      const { scope } = await wideScope(c, P.view);
      return c.json({ items: await deps(c).bonuses.list({ ...c.req.valid("query"), ...(scope.kind === "department" ? { department: scope.department } : {}) }) });
    })
    .post("/", requireStaffPermission(P.create), zValidator("json", awardBody), async (c) => {
      const d = deps(c);
      const body = c.req.valid("json");
      const { scope, self } = await wideScope(c, P.create);
      const staff = await d.staff.byId(body.staffId);
      if (!staff || !scopeReaches(scope, staff)) throw new AppError("bad_request", "Choose a staff member you look after.");
      if (staff.staffId === self?.staffId) throw new AppError("permission_denied", "You cannot give yourself a bonus.");
      return c.json(await awardBonus(d, actorOf(c).name, body), 201);
    })
    .post("/buffet/redeem", requireStaffPermission(P.buffet), zValidator("json", redeemBody), async (c) => c.json(await redeemBuffet(deps(c), c.req.valid("json"), actorOf(c).name)))
    .get("/settings", requirePermission(P.view), async (c) => c.json(await deps(c).rules.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "bonuses-rewards", action: "rules.changed", recordType: "settings", recordId: "rules", summary: `Bonuses: cash ${rules.cashEnabled ? "on" : "off"}, buffet ${rules.buffetEnabled ? "on" : "off"}, approval ${rules.requireApproval ? "needed" : "not needed"}` });
      return c.json(rules);
    })
    .post("/:id/decide", requireStaffPermission(P.approve), zValidator("json", decideBody), async (c) => {
      const d = deps(c);
      const { scope, self } = await wideScope(c, P.approve);
      const bonus = await d.bonuses.get(c.req.param("id"));
      if (!bonus || !scopeReaches(scope, bonus)) throw new AppError("not_found", "Bonus not found.");
      if (bonus.staffId === self?.staffId) throw new AppError("permission_denied", "Your own bonus is decided by someone else.");
      return c.json(await decideBonus(d, bonus, actorOf(c).name, c.req.valid("json").approve));
    });
}
