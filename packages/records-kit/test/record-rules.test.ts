/** The records kit's pure rules: building defaults, cleaning forms and checking moves. */

import { describe, expect, it } from "vitest";
import { choice, field, steps } from "../src/domain/builders";
import { checkMove, cleanFields, startStatus, titleFor } from "../src/domain/record-rules";
import type { RecordType } from "../src/domain/record-type";

const leave: RecordType = {
  key: "leave",
  name: "Leave request",
  active: true,
  selfService: true,
  fields: [choice("kind", "Leave type", ["Annual", "Sick"], { required: true }), field("days", "Days", "number", { required: true }), field("paid", "Paid", "yesno"), field("from", "From", "date")],
  statuses: steps("Requested", "Approved!", "Taken.", "Rejected."),
};

describe("records kit rules", () => {
  it("builds statuses from short labels", () => {
    expect(leave.statuses.map((s) => [s.key, !!s.approval, !!s.done])).toEqual([["requested", false, false], ["approved", true, false], ["taken", false, true], ["rejected", false, true]]);
    expect(startStatus(leave).key).toBe("requested");
    expect(steps("Checked!.")).toEqual([{ key: "checked", label: "Checked", approval: true, done: true }]);
  });

  it("cleans a form against the type's fields", () => {
    expect(cleanFields(leave, { kind: "Sick", days: "3", paid: "yes", extra: "dropped" })).toEqual({ kind: "Sick", days: 3, paid: true, from: null });
    expect(() => cleanFields(leave, { kind: "Holiday", days: 1 })).toThrow(/one of/);
    expect(() => cleanFields(leave, { kind: "Sick" })).toThrow(/Days is needed/);
    expect(() => cleanFields(leave, { kind: "Sick", days: 1, from: "tomorrow" })).toThrow(/date/);
    // An edit only touches the fields it sends.
    expect(cleanFields(leave, { days: 2 }, true)).toEqual({ days: 2 });
  });

  it("titles a record from its first text or choice field", () => {
    expect(titleFor(leave, { kind: "Annual" })).toBe("Annual");
    expect(titleFor(leave, {}, "  My title ")).toBe("My title");
    expect(titleFor(leave, {})).toBe("Leave request");
  });

  it("keeps approval statuses for approvers", () => {
    expect(() => checkMove(leave, "approved", false)).toThrow(/approver/);
    expect(checkMove(leave, "approved", true).key).toBe("approved");
    expect(() => checkMove(leave, "lost", true)).toThrow(/no status/);
  });
});
