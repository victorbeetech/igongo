/** Daily Reports' pure rules: which reports the writer may still change. */

import { describe, expect, it } from "vitest";
import { isEditable } from "../src/domain/daily-report";
import { DEFAULT_TEMPLATE } from "../src/domain/report-template";

describe("daily reports", () => {
  it("lock once sent, and unlock when returned", () => {
    expect(isEditable({ status: "draft" })).toBe(true);
    expect(isEditable({ status: "returned" })).toBe(true);
    expect(isEditable({ status: "submitted" })).toBe(false);
    expect(isEditable({ status: "signed" })).toBe(false);
    expect(DEFAULT_TEMPLATE.sections.length).toBeGreaterThan(0);
  });
});
