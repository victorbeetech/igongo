/** Spa / Humura is set up as a booking module with its own code prefix. */

import { describe, expect, it } from "vitest";
import { spaModule } from "../src/domain/spa-module";

describe("Spa / Humura", () => {
  it("is set up as a booking module", () => {
    expect(spaModule).toMatchObject({ key: "spa", prefix: "SP", kinds: ["slot"] });
  });
});
