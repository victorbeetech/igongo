/** Crafts & Bookshop sells only stock offerings, with its own code prefix. */

import { describe, expect, it } from "vitest";
import { craftsBookshopModule } from "../src/domain/crafts-bookshop-module";

describe("Crafts & Bookshop", () => {
  it("is set up as a booking module", () => {
    expect(craftsBookshopModule).toMatchObject({ key: "crafts-bookshop", prefix: "SH", kinds: ["stock"] });
  });
});
