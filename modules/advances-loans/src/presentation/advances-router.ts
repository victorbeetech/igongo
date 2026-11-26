/**
 * Advances & Loans HTTP routes, mounted by the gateway at `/api/advances`.
 *
 *   GET   /advances/mine              my advances and loans, and the rules   S30-01
 *   POST  /advances/mine              ask for one                            S30-01
 *   POST  /advances/mine/:id/cancel   take my request back                   S30-01
 *   GET   /advances                   requests in my scope (staff tool)      S30-02
 *   GET   /advances/settings          the rules                              S30-05
 *   PUT   /advances/settings          change them                            S30-05
 *   GET   /advances/:id               one, with its repayments               S30-03
 *   POST  /advances/:id/decide        approve or decline                     S30-02
 *   POST  /advances/:id/disburse      pay it out                             S30-03
 *   POST  /advances/:id/repay         take a cash repayment                  S30-04
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, recordChange, requirePermission, requireStaffPermission, scopeReaches, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { AdvancesDeps } from "../application/advances-deps";
import { cancelAdvance, decideAdvance, disburseAdvance, repayInCash } from "../application/use-cases/advance-steps";
import { requestAdvance } from "../application/use-cases/request-advance";
import type { Advance } from "../domain/advance";
import { payMonthOf } from "../domain/pay-month";
import { ADVANCE_PERMISSIONS as P } from "./permissions";
import { decideBody, listQuery, repayBody, requestBody, rulesBody } from "./request-schemas";

export function advancesRouter(deps: (c: Context<ActorEnv>) => AdvancesDeps) {
  /** The caller's own staff record. @throws AppError `not_found` */
  async function self(c: Context<ActorEnv>): Promise<StaffRef> {
    const me = await deps(c).staff.byUserId(actorOf(c).userId);
    if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
    return me;
  }

  /** The advance in the address, if [permission]'s scope reaches it (wider than own). @throws AppError */
  async function reachable(c: Context<ActorEnv>, permission: string): Promise<Advance> {
    const d = deps(c);
    const advance = await d.advances.get(c.req.param("id") as string);
    const scope = staffScope(actorOf(c), permission, await d.staff.byUserId(actorOf(c).userId));
    if (!advance || !scope || scope.kind === "own" || !scopeReaches(scope, advance)) throw new AppError("not_found", "Advance not found.");
    return advance;
  }

  return (
    new Hono<ActorEnv>()
      .get("/mine", requirePermission(P.view), async (c) => {
        const d = deps(c);
        const me = await self(c);
        return c.json({ items: await d.advances.list({ staffId: me.staffId, limit: 200 }), rules: await d.rules.read() });
      })
      .post("/mine", requirePermission(P.create), zValidator("json", requestBody), async (c) => c.json(await requestAdvance(deps(c), await self(c), c.req.valid("json")), 201))
      .post("/mine/:id/cancel", requirePermission(P.create), async (c) => {
        const d = deps(c);
        const me = await self(c);
        const advance = await d.advances.get(c.req.param("id"));
        if (!advance || advance.staffId !== me.staffId) throw new AppError("not_found", "Advance not found.");
        return c.json(await cancelAdvance(d, advance));
      })
      .get("/", requireStaffPermission(P.view), zValidator("query", listQuery), async (c) => {
        const d = deps(c);
        const scope = staffScope(actorOf(c), P.view, await d.staff.byUserId(actorOf(c).userId));
        const q = c.req.valid("query");
        return c.json({ items: await d.advances.list({ ...q, ...(scope?.kind === "department" ? { department: scope.department } : {}) }) });
      })
      .get("/settings", requirePermission(P.view), async (c) => c.json(await deps(c).rules.read()))
      .put("/settings", requireStaffPermission(P.settings), zValidator("json", rulesBody), async (c) => {
        const d = deps(c);
        const rules = c.req.valid("json");
        await d.rules.write(rules, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "advances-loans", action: "rules.changed", recordType: "settings", recordId: "rules", summary: `Advances ${rules.advance.enabled ? "on" : "off"}, loans ${rules.loan.enabled ? "on" : "off"}` });
        return c.json(rules);
      })
      .get("/:id", async (c) => {
        const d = deps(c);
        const advance = await d.advances.get(c.req.param("id"));
        // The staff member always sees their own; others need a wider scope.
        const me = await d.staff.byUserId(actorOf(c).userId);
        const visible = advance && (advance.staffId === me?.staffId || (await reachable(c, P.view).then(() => true, () => false)));
        if (!advance || !visible) throw new AppError("not_found", "Advance not found.");
        return c.json({ advance, repayments: await d.advances.repayments(advance.id) });
      })
      .post("/:id/decide", requireStaffPermission(P.approve), zValidator("json", decideBody), async (c) => {
        const advance = await reachable(c, P.approve);
        // Nobody approves their own.
        if (advance.staffId === (await deps(c).staff.byUserId(actorOf(c).userId))?.staffId) throw new AppError("permission_denied", "Your own request is decided by someone else.");
        return c.json(await decideAdvance(deps(c), advance, actorOf(c).name, c.req.valid("json")));
      })
      .post("/:id/disburse", requireStaffPermission(P.edit), async (c) => c.json(await disburseAdvance(deps(c), await reachable(c, P.edit), actorOf(c).name)))
      .post("/:id/repay", requireStaffPermission(P.edit), zValidator("json", repayBody), async (c) => {
        const d = deps(c);
        const body = c.req.valid("json");
        return c.json(await repayInCash(d, await reachable(c, P.edit), body.amount, actorOf(c).name, body.period ?? payMonthOf(d.change.now)));
      })
  );
}
