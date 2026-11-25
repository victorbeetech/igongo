/**
 * Roles & Permissions HTTP routes, mounted by the gateway at `/access`.
 *
 *   GET    /access/me                       my roles, permissions, menu and tiles
 *   GET    /access/catalog                  modules, actions and scopes for the role builder
 *   GET    /access/roles                    list roles (?archived=true to include archived)
 *   POST   /access/roles                    create (blank or cloneFromRoleId)
 *   GET    /access/roles/:id                one role, with its holders
 *   PATCH  /access/roles/:id                edit details, permissions, included roles
 *   POST   /access/roles/:id/archive        archive   (and /restore)
 *   DELETE /access/roles/:id                delete (only with no holders)
 *   GET    /access/users/:userId/roles      a person's roles
 *   POST   /access/users/:userId/roles      give a role (optional dates)
 *   DELETE /access/users/:userId/roles/:roleId  take a role away
 *   GET    /access/report/who-can?permission=   who can do X, and why
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import modules from "@igongo/contracts/catalog/modules.json";
import { DATA_SCOPES } from "@igongo/contracts/roles-permissions";
import { actorOf, AppError, requirePermission, type ActorEnv } from "@igongo/core";
import type { ChangeContext } from "../application/change-context";
import type { AssignmentRepository } from "../application/ports/assignment-repository";
import type { RoleRepository } from "../application/ports/role-repository";
import { deleteRole, setRoleArchived } from "../application/use-cases/archive-role";
import { assignRole, unassignRole } from "../application/use-cases/assign-role";
import { createRole } from "../application/use-cases/create-role";
import { updateRole } from "../application/use-cases/update-role";
import { whoCan } from "../application/use-cases/who-can";
import { STANDARD_ACTIONS } from "../domain/permission-key";
import { ROLE_PERMISSIONS as P } from "./permissions";
import { assignBody, createRoleBody, listQuery, updateRoleBody, whoCanQuery } from "./request-schemas";

/** What the routes need, built per request by the gateway. */
export interface RolesDeps {
  roles: RoleRepository;
  assignments: AssignmentRepository;
  /** The change context for the signed-in caller (who, audit recorder, clock). */
  change: ChangeContext;
}

export function rolesRouter(deps: (c: Context<ActorEnv>) => RolesDeps) {
  return (
    new Hono<ActorEnv>()
      // The caller's own access: what the apps build menus from.
      .get("/me", (c) => c.json(actorOf(c).access))
      .get("/catalog", requirePermission(P.viewRoles), (c) => c.json({ modules, actions: STANDARD_ACTIONS, scopes: DATA_SCOPES }))
      .get("/roles", requirePermission(P.viewRoles), zValidator("query", listQuery), async (c) => {
        return c.json({ items: await deps(c).roles.list(c.req.valid("query").archived === "true") });
      })
      .post("/roles", requirePermission(P.createRoles), zValidator("json", createRoleBody), async (c) => {
        const d = deps(c);
        return c.json(await createRole(d.roles, d.change, c.req.valid("json")), 201);
      })
      .get("/roles/:id", requirePermission(P.viewRoles), async (c) => {
        const d = deps(c);
        const role = await d.roles.get(c.req.param("id"));
        if (!role) throw new AppError("not_found", "Role not found.");
        return c.json({ ...role, holders: await d.assignments.ofRole(role.id) });
      })
      .patch("/roles/:id", requirePermission(P.editRoles), zValidator("json", updateRoleBody), async (c) => {
        const d = deps(c);
        return c.json(await updateRole(d.roles, d.change, c.req.param("id"), c.req.valid("json")));
      })
      .post("/roles/:id/archive", requirePermission(P.editRoles), async (c) => {
        await setRoleArchived(deps(c).roles, deps(c).change, c.req.param("id"), true);
        return c.body(null, 204);
      })
      .post("/roles/:id/restore", requirePermission(P.editRoles), async (c) => {
        await setRoleArchived(deps(c).roles, deps(c).change, c.req.param("id"), false);
        return c.body(null, 204);
      })
      .delete("/roles/:id", requirePermission(P.deleteRoles), async (c) => {
        await deleteRole(deps(c), deps(c).change, c.req.param("id"));
        return c.body(null, 204);
      })
      .get("/users/:userId/roles", requirePermission(P.viewAssignments), async (c) => {
        return c.json({ items: await deps(c).assignments.ofUser(c.req.param("userId")) });
      })
      .post("/users/:userId/roles", requirePermission(P.assign), zValidator("json", assignBody), async (c) => {
        await assignRole(deps(c), deps(c).change, { userId: c.req.param("userId"), ...c.req.valid("json") });
        return c.body(null, 204);
      })
      .delete("/users/:userId/roles/:roleId", requirePermission(P.unassign), async (c) => {
        await unassignRole(deps(c), deps(c).change, c.req.param("userId"), c.req.param("roleId"));
        return c.body(null, 204);
      })
      .get("/report/who-can", requirePermission(P.viewReport), zValidator("query", whoCanQuery), async (c) => {
        return c.json({ items: await whoCan(deps(c), c.req.valid("query").permission, deps(c).change.now) });
      })
  );
}
