/** The Notice Board's pure rules: who sees a post. */

import { describe, expect, it } from "vitest";
import { canSee } from "../src/domain/notice";

describe("post audience", () => {
  it("shows posts for everyone to staff, and role posts to holders only", () => {
    const all = { audienceRoles: [], removedAt: null };
    const gate = { audienceRoles: ["gatekeeper"], removedAt: null };
    expect(canSee(all, { roleKeys: ["staff-base"], isStaff: true })).toBe(true);
    expect(canSee(all, { roleKeys: ["guest"], isStaff: false })).toBe(false);
    expect(canSee(gate, { roleKeys: ["staff-base"], isStaff: true })).toBe(false);
    expect(canSee(gate, { roleKeys: ["gatekeeper"], isStaff: true })).toBe(true);
    expect(canSee({ ...all, removedAt: new Date() }, { roleKeys: [], isStaff: true })).toBe(false);
  });
});
