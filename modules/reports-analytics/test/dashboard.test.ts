/** Reports & Analytics' rules: a failing module never breaks the dashboard; day ranges in hotel time. */

import { describe, expect, it } from "vitest";
import { readDashboard } from "../src/application/use-cases/read-dashboard";
import { hotelRange } from "../src/domain/hotel-range";

describe("dashboard", () => {
  it("marks a failing source and hides tiles", async () => {
    const groups = await readDashboard(
      [
        { module: "a", title: "A", read: async () => [{ key: "a.x", label: "X", value: 1, unit: "count" }, { key: "a.y", label: "Y", value: 2, unit: "count" }] },
        { module: "b", title: "B", read: async () => Promise.reject(new Error("down")) },
      ],
      { from: new Date(), to: new Date() },
      ["a.y"],
    );
    expect(groups[0]?.kpis.map((k) => k.key)).toEqual(["a.x"]);
    expect(groups[1]).toMatchObject({ module: "b", failed: true, kpis: [] });
  });

  it("counts whole Kampala days", () => {
    const r = hotelRange(new Date("2026-11-26T10:00:00Z"), 7);
    expect(r).toMatchObject({ fromDay: "2026-11-20", toDay: "2026-11-26" });
    expect(r.from.toISOString()).toBe("2026-11-19T21:00:00.000Z");
    expect(r.to.toISOString()).toBe("2026-11-26T21:00:00.000Z");
  });
});
