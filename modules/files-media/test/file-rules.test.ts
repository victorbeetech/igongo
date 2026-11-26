/** Files & Media's pure rules: the super admin's upload limits. */

import { describe, expect, it } from "vitest";
import { DEFAULT_FILE_RULES, ruleBreak } from "../src/domain/file-rules";

describe("upload limits", () => {
  it("allows photos under the size limit and refuses others", () => {
    expect(ruleBreak(DEFAULT_FILE_RULES, { type: "image/jpeg", size: 1000 })).toBeNull();
    expect(ruleBreak(DEFAULT_FILE_RULES, { type: "application/x-msdownload", size: 1000 })).toMatch(/not allowed/);
    expect(ruleBreak(DEFAULT_FILE_RULES, { type: "image/png", size: 9 * 1024 * 1024 })).toMatch(/at most 8 MB/);
    expect(ruleBreak(DEFAULT_FILE_RULES, { type: "image/png", size: 0 })).toMatch(/empty/);
  });
});
