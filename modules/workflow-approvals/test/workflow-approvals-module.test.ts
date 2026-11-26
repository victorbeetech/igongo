/** Approvals's starting set-up is valid: unique keys, a start status for every type, and fields the kit can clean. */

import { cleanFields, startStatus } from "@igongo/records-kit";
import { describe, expect, it } from "vitest";
import { workflowApprovalsModule } from "../src/domain/workflow-approvals-module";

describe("Approvals", () => {
  it("has a valid starting set-up", () => {
    const types = workflowApprovalsModule.defaults.types;
    expect(workflowApprovalsModule).toMatchObject({ key: "workflow-approvals", prefix: "AP" });
    expect(new Set(types.map((t) => t.key)).size).toBe(types.length);
    for (const t of types) {
      expect(startStatus(t).key).toBeTruthy();
      expect(new Set(t.fields.map((f) => f.key)).size).toBe(t.fields.length);
      expect(new Set(t.statuses.map((s) => s.key)).size).toBe(t.statuses.length);
    }
  });

  it("refuses a approval request without its required fields", () => {
    const t = workflowApprovalsModule.defaults.types[0];
    if (!t || !t.fields.some((f) => f.required)) return;
    expect(() => cleanFields(t, {})).toThrow(/needed/);
  });
});
