/** Faults & Maintenance's pure rules: a fault's life. */

import { describe, expect, it } from "vitest";
import { canMove, isOpen } from "../src/domain/fault-status";

describe("a fault's life", () => {
  it("goes open, assigned, in progress, fixed, closed, and can be reopened", () => {
    expect(canMove("open", "assigned")).toBe(true);
    expect(canMove("assigned", "fixed")).toBe(true);
    expect(canMove("fixed", "closed")).toBe(true);
    expect(canMove("fixed", "in_progress")).toBe(true);
    expect(canMove("open", "closed")).toBe(false);
    expect(canMove("cancelled", "open")).toBe(false);
    expect(isOpen("on_hold")).toBe(true);
    expect(isOpen("fixed")).toBe(false);
  });
});
