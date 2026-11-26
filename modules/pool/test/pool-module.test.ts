/** Pool sells only slot offerings, with its own code prefix. */

import { describe, expect, it } from "vitest";
import { poolModule } from "../src/domain/pool-module";

describe("Pool", () => {
  it("is set up as a booking module", () => {
    expect(poolModule).toMatchObject({ key: "pool", prefix: "PL", kinds: ["slot"] });
  });
});
