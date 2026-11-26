/** Organisation's starting set-up is valid: unique keys, a start status for every type, and fields the kit can clean. */

import { cleanFields, startStatus } from "@igongo/records-kit";
import { describe, expect, it } from "vitest";
import { locationsDepartmentsModule } from "../src/domain/locations-departments-module";

describe("Organisation", () => {
  it("has a valid starting set-up", () => {
    const types = locationsDepartmentsModule.defaults.types;
    expect(locationsDepartmentsModule).toMatchObject({ key: "locations-departments", prefix: "OR" });
    expect(new Set(types.map((t) => t.key)).size).toBe(types.length);
    for (const t of types) {
      expect(startStatus(t).key).toBeTruthy();
      expect(new Set(t.fields.map((f) => f.key)).size).toBe(t.fields.length);
      expect(new Set(t.statuses.map((s) => s.key)).size).toBe(t.statuses.length);
    }
  });

  it("refuses a department without its required fields", () => {
    const t = locationsDepartmentsModule.defaults.types[0];
    if (!t || !t.fields.some((f) => f.required)) return;
    expect(() => cleanFields(t, {})).toThrow(/needed/);
  });
});
