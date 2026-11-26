/**
 * HR Records HTTP routes, mounted by the gateway at `/api/hr`.
 *
 *   GET    /hr/staff/me     my profile at work (S22-08)
 *   GET    /hr/staff        the staff directory, within my scope (S22-01)
 *   POST   /hr/staff        enrol a new staff member (S22-03)
 *   GET    /hr/staff/:id    one profile, within my scope (S22-02)
 *   PATCH  /hr/staff/:id    change a profile (S22-04)
 */

import { zValidator } from "@hono/zod-validator";
import type { RoleAssigner } from "@igongo/contracts/roles-permissions";
import { actorOf, AppError, recordChange, requirePermission, scopeReaches, staffScope, type ActorEnv, type ChangeContext } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { StaffRepository } from "../application/ports/staff-repository";
import { enrolStaff } from "../application/use-cases/enrol-staff";
import { updateStaff } from "../application/use-cases/update-staff";
import { HR_PERMISSIONS as P } from "./permissions";
import { enrolBody, searchQuery, updateBody } from "./request-schemas";

/** What the routes need, built per request by the gateway. */
export interface HrDeps {
  staff: StaffRepository;
  roles: RoleAssigner;
  change: ChangeContext;
}

export function hrRouter(deps: (c: Context<ActorEnv>) => HrDeps) {
  /** The staff records the caller may see, or a refusal. */
  async function viewScope(c: Context<ActorEnv>) {
    const actor = actorOf(c);
    const self = await deps(c).staff.byUserId(actor.userId);
    const scope = staffScope(actor, P.view, self);
    if (!scope) throw new AppError("permission_denied", `You need the permission ${P.view}.`);
    return scope;
  }

  return (
    new Hono<ActorEnv>()
      // My own profile: every staff member, no permission needed.
      .get("/staff/me", async (c) => {
        const self = await deps(c).staff.byUserId(actorOf(c).userId);
        if (!self) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
        return c.json(await deps(c).staff.get(self.staffId));
      })
      .get("/staff", zValidator("query", searchQuery), async (c) => {
        const scope = await viewScope(c);
        const query = c.req.valid("query");
        // Narrow the search to what the scope reaches.
        const filter = scope.kind === "all" ? query : scope.kind === "department" ? { ...query, department: scope.department } : { ...query, staffId: scope.staffId };
        return c.json({ items: await deps(c).staff.search(filter) });
      })
      .post("/staff", requirePermission(P.create), zValidator("json", enrolBody), async (c) => {
        return c.json(await enrolStaff(deps(c), deps(c).change, c.req.valid("json")), 201);
      })
      .get("/staff/:id", async (c) => {
        const scope = await viewScope(c);
        const member = await deps(c).staff.get(c.req.param("id"));
        // Out of scope reads the same as missing, so nothing leaks.
        if (!member || !scopeReaches(scope, member)) throw new AppError("not_found", "Staff member not found.");
        // Personal details (phone, email, emergency contact) seen by someone else are logged.
        if (member.userId !== actorOf(c).userId) {
          await recordChange(deps(c).change, { module: "hr-records", action: "staff.viewed", recordType: "staff", recordId: member.staffId, summary: `Viewed ${member.name}'s staff record` });
        }
        return c.json(member);
      })
      .patch("/staff/:id", requirePermission(P.edit), zValidator("json", updateBody), async (c) => {
        return c.json(await updateStaff(deps(c), deps(c).change, c.req.param("id"), c.req.valid("json")));
      })
  );
}
