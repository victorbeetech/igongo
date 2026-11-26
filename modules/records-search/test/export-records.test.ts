/** Records Archive & Search: exports page through the whole trail and are recorded. */

import type { AuditEntryInput, AuditRecord } from "@igongo/contracts/audit-trail";
import { describe, expect, it } from "vitest";
import { exportRecords } from "../src/application/use-cases/export-records";

describe("export", () => {
  it("reads every page and records the export", async () => {
    const entries: AuditRecord[] = Array.from({ length: 450 }, (_, i) => ({ seq: 450 - i, id: `e${i}`, occurredAt: new Date(), actorId: "u", actorName: "Sam", module: "payroll", action: "x", summary: i === 0 ? "=SUM(A1)" : `Did ${i}` }));
    const recorded: AuditEntryInput[] = [];
    const trail = {
      search: async (q: { beforeSeq?: number; limit: number }) => {
        const items = entries.filter((e) => !q.beforeSeq || e.seq < q.beforeSeq).slice(0, q.limit);
        return { items, nextBeforeSeq: items.length === q.limit ? (items.at(-1)?.seq ?? null) : null };
      },
    };
    const out = await exportRecords({ trail, change: { actorId: "a", audit: { record: async (e) => void recorded.push(e) }, now: new Date() } }, { text: "Did" });
    expect(out.rows).toBe(450);
    expect(out.csv).toContain("'=SUM(A1)");
    expect(recorded[0]?.action).toBe("records.exported");
  });
});
