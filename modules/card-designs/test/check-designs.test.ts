/** Unit tests of the design rules and template choice per role. */

import { describe, expect, it } from "vitest";
import { templateFor } from "../src/domain/card-designs";
import { checkDesigns } from "../src/domain/check-designs";
import { DEFAULT_CARD_DESIGNS } from "../src/domain/default-designs";

describe("card designs", () => {
  it("starts with a valid set whose default is the black portrait card", () => {
    expect(checkDesigns(DEFAULT_CARD_DESIGNS)).toBeNull();
    expect(templateFor(DEFAULT_CARD_DESIGNS, ["chef"])?.key).toBe("portrait-black");
  });

  it("uses a role's own template when it has one", () => {
    const d = { ...DEFAULT_CARD_DESIGNS, byRole: { chef: "landscape-red" } };
    expect(templateFor(d, ["waiter", "chef"])?.key).toBe("landscape-red");
  });

  it("refuses an element off the card, a missing QR and a role on a missing template", () => {
    const [black, red] = DEFAULT_CARD_DESIGNS.templates as [typeof DEFAULT_CARD_DESIGNS.templates[0], typeof DEFAULT_CARD_DESIGNS.templates[0]];
    const off = { ...black, front: { ...black.front, elements: black.front.elements.map((e) => ({ ...e, x: 500 })) } };
    expect(checkDesigns({ ...DEFAULT_CARD_DESIGNS, templates: [off, red] })).toMatch(/off the card/);
    const noQr = { ...red, back: { ...red.back, elements: red.back.elements.filter((e) => e.kind !== "qr") } };
    expect(checkDesigns({ ...DEFAULT_CARD_DESIGNS, templates: [black, noQr] })).toMatch(/QR/);
    expect(checkDesigns({ ...DEFAULT_CARD_DESIGNS, byRole: { chef: "gone" } })).toMatch(/chef/);
  });
});
