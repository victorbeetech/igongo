/**
 * Roles & Permissions on a real Postgres (PGlite) with the real migrations,
 * including the 121 pre-made roles seeded from docs/roles.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { accessProfile, DrizzleAssignmentRepository, DrizzleRoleRepository } from "../src";
import { deleteRole, setRoleArchived } from "../src/application/use-cases/archive-role";
import { assignRole } from "../src/application/use-cases/assign-role";
import { createRole } from "../src/application/use-cases/create-role";
import { updateRole } from "../src/application/use-cases/update-role";
import { whoCan } from "../src/application/use-cases/who-can";
import { freshDb, memoryAudit } from "./helpers";

const now = new Date("2026-11-25T10:00:00Z");

describe("Roles & Permissions", () => {
  let deps: { roles: DrizzleRoleRepository; assignments: DrizzleAssignmentRepository };
  let audit: ReturnType<typeof memoryAudit>;
  let ctx: { actorId: string; audit: ReturnType<typeof memoryAudit>; now: Date };
  beforeEach(async () => {
    const { db } = await freshDb();
    deps = { roles: new DrizzleRoleRepository(db), assignments: new DrizzleAssignmentRepository(db) };
    audit = memoryAudit();
    ctx = { actorId: "admin", audit, now };
  });

  it("seeds all 121 pre-made roles with permissions and includes", async () => {
    const all = await deps.roles.list(false);
    expect(all).toHaveLength(121);
    const waiter = await deps.roles.getByKey("waiter");
    expect(waiter?.includedRoleIds).toContain("role_staff-base");
    expect((await deps.roles.getByKey("guest"))?.isStaff).toBe(false);
  });

  it("combines several roles, their included roles and time windows", async () => {
    await assignRole(deps, ctx, { userId: "ann", roleId: "role_pool-attendant" });
    await assignRole(deps, ctx, { userId: "ann", roleId: "role_museum-guide", startsAt: new Date("2026-12-01") });
    const profile = await accessProfile(deps, "ann", now);
    expect(profile.roles.map((r) => r.key)).toEqual(["pool-attendant", "staff-base"]);
    expect(profile.menu).toContain("pool");
    expect(profile.menu).toContain("attendance");
    expect(profile.isStaff).toBe(true);
    const later = await accessProfile(deps, "ann", new Date("2026-12-02"));
    expect(later.roles.map((r) => r.key)).toContain("museum-guide");
  });

  it("creates, clones, edits and records each change", async () => {
    const chef = await createRole(deps.roles, ctx, { key: "head-baker", name: "Head Baker", cloneFromRoleId: "role_executive-chef" });
    expect(chef.permissions.length).toBeGreaterThan(0);
    const edited = await updateRole(deps.roles, ctx, chef.id, { name: "Baker", permissions: [{ key: "menu-catalogue.*.view", scope: "all" }] });
    expect(edited.permissions).toEqual([{ key: "menu-catalogue.*.view", scope: "all" }]);
    expect(audit.entries.map((e) => e.action)).toEqual(["role.created", "role.updated"]);
    expect(audit.entries[1]?.changes?.["name"]).toEqual({ old: "Head Baker", new: "Baker" });
    await expect(createRole(deps.roles, ctx, { key: "head-baker", name: "x" })).rejects.toThrow(/already exists/);
    await expect(updateRole(deps.roles, ctx, chef.id, { permissions: [{ key: "bad key", scope: "all" }] })).rejects.toThrow(/valid/);
  });

  it("refuses to delete a held role, and archived roles give no access", async () => {
    await assignRole(deps, ctx, { userId: "bob", roleId: "role_waiter" });
    await expect(deleteRole(deps, ctx, "role_waiter")).rejects.toThrow(/hold this role/);
    await setRoleArchived(deps.roles, ctx, "role_waiter", true);
    expect((await accessProfile(deps, "bob", now)).roles).toEqual([]);
  });

  it("reports who can do X and why", async () => {
    await assignRole(deps, ctx, { userId: "sam", roleId: "role_super-admin" });
    const rows = await whoCan(deps, "audit-trail.entries.view", now);
    expect(rows.find((r) => r.roleId === "role_super-admin")?.holders).toEqual(["sam"]);
  });
});
