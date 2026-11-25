/** Attendance's pure rules: late marks, toggling and the day summary. */

import { describe, expect, it } from "vitest";
import { DEFAULT_RULES, isLate } from "../src/domain/attendance-rules";
import type { ClockEvent } from "../src/domain/clock-event";
import { summarizeDay } from "../src/domain/day-summary";
import { nextKind } from "../src/domain/next-kind";

/** An event at [utc] (Kampala is UTC+3). */
const ev = (kind: "in" | "out", utc: string, late = false): ClockEvent => ({ id: utc, staffId: "s1", department: "kitchen", kind, method: "nfc", at: new Date(utc), workDate: "2026-11-25", station: "Gate", late, recordedBy: null, note: null });

describe("attendance rules", () => {
  it("marks clock-ins after start plus grace as late, in hotel time", () => {
    expect(isLate(DEFAULT_RULES, new Date("2026-11-25T05:10:00Z"))).toBe(false); // 08:10
    expect(isLate(DEFAULT_RULES, new Date("2026-11-25T05:11:00Z"))).toBe(true); // 08:11
  });
  it("toggles in and out", () => {
    expect(nextKind(null)).toBe("in");
    expect(nextKind(ev("in", "2026-11-25T05:00:00Z"))).toBe("out");
  });
  it("adds up time on site, counting an open clock-in until now", () => {
    const day = summarizeDay([ev("out", "2026-11-25T09:00:00Z"), ev("in", "2026-11-25T05:00:00Z", true), ev("in", "2026-11-25T10:00:00Z")], new Date("2026-11-25T11:00:00Z"));
    expect(day).toMatchObject({ minutesOnSite: 300, late: true, onSite: true, events: 3 });
    expect(summarizeDay([], new Date())).toBeNull();
  });
});
