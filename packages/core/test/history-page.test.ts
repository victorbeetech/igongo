/** Tests for the shared history paging: one page, and the cursor for the older one. */

import { describe, expect, it } from "vitest";
import { historyPage } from "../src";

/** Rows newest first, one minute apart, as the repositories return them. */
function rows(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: `r${i}`, createdAt: new Date(Date.UTC(2026, 10, 28, 12, 60 - i)) }));
}

describe("historyPage", () => {
  it("returns every row and no cursor on the last page", () => {
    const page = historyPage(rows(3), 5);
    expect(page.items.map((r) => r.id)).toEqual(["r0", "r1", "r2"]);
    expect(page.nextBefore).toBeNull();
  });

  it("keeps one page and points the cursor at its last row when an extra row exists", () => {
    // Step check: 3 rows read for a page of 2 means row r2 is only proof that an older page exists.
    const page = historyPage(rows(3), 2);
    expect(page.items.map((r) => r.id)).toEqual(["r0", "r1"]);
    expect(page.nextBefore).toBe(new Date(Date.UTC(2026, 10, 28, 12, 59)).toISOString());
  });

  it("returns an empty page with no cursor when there is no history", () => {
    expect(historyPage([], 10)).toEqual({ items: [], nextBefore: null });
  });
});
