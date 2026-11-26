/** Museum sells only slot offerings, with its own code prefix. */

import { describe, expect, it } from "vitest";
import { museumModule } from "../src/domain/museum-module";

describe("Museum", () => {
  it("is set up as a booking module", () => {
    expect(museumModule).toMatchObject({ key: "museum", prefix: "MU", kinds: ["slot"] });
  });
});
