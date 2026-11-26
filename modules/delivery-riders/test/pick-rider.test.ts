/** Delivery & Riders' automatic assignment: the online rider with the fewest current jobs. */

import { describe, expect, it } from "vitest";
import { pickRider } from "../src/domain/pick-rider";
import type { RiderStatus } from "../src/domain/rider-status";

const rider = (userId: string, minute: number): RiderStatus => ({ userId, name: userId, online: true, lat: null, lng: null, locationAt: null, updatedAt: new Date(2026, 10, 26, 9, minute) });

describe("automatic assignment", () => {
  it("picks the least busy rider, then the one online longest", () => {
    expect(pickRider([rider("a", 1), rider("b", 2)], new Map([["a", 2], ["b", 1]]))?.userId).toBe("b");
    expect(pickRider([rider("a", 5), rider("b", 2)], new Map())?.userId).toBe("b");
    expect(pickRider([], new Map())).toBeNull();
  });
});
