/** Chat's pure rules: who answers which desk. */

import { describe, expect, it } from "vitest";
import { DEFAULT_CHAT_SETTINGS } from "../src/domain/chat-settings";
import { desksOf } from "../src/domain/chat-viewer";

describe("desks", () => {
  it("are answered by staff holding a desk role, never by guests", () => {
    const desks = DEFAULT_CHAT_SETTINGS.desks;
    expect(desksOf(desks, { userId: "r", name: "Rita", isStaff: true, roleKeys: ["receptionist"] })).toEqual(["front-desk"]);
    expect(desksOf(desks, { userId: "c", name: "Cook", isStaff: true, roleKeys: ["cook"] })).toEqual([]);
    expect(desksOf(desks, { userId: "g", name: "Grace", isStaff: false, roleKeys: ["receptionist"] })).toEqual([]);
  });
});
