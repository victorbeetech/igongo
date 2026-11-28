/** Tests for the guest view: switched-off items are hidden and the rest sort by sort order. */

import { describe, expect, it } from "vitest";
import { activeContent } from "../src/domain/active-content";
import { EMPTY_GUEST_CONTENT } from "../src/domain/content";

describe("activeContent", () => {
  it("returns empty lists for an empty document", () => {
    expect(activeContent(EMPTY_GUEST_CONTENT)).toEqual(EMPTY_GUEST_CONTENT);
  });

  it("hides switched-off banners and sorts the rest", () => {
    const out = activeContent({
      ...EMPTY_GUEST_CONTENT,
      banners: [
        { id: "b", active: true, sortOrder: 2, title: "Second", subtitle: null, imageUrl: null, linkTarget: null },
        { id: "a", active: false, sortOrder: 0, title: "Hidden", subtitle: null, imageUrl: null, linkTarget: null },
        { id: "c", active: true, sortOrder: 1, title: "First", subtitle: null, imageUrl: null, linkTarget: null },
      ],
    });
    expect(out.banners.map((b) => b.id)).toEqual(["c", "b"]);
  });

  it("does not change the input document", () => {
    const input = { ...EMPTY_GUEST_CONTENT, didYouKnow: [{ id: "d", active: false, sortOrder: 0, title: "t", body: "b" }] };
    activeContent(input);
    expect(input.didYouKnow).toHaveLength(1);
  });
});
