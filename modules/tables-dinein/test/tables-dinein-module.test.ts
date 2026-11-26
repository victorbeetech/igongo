/** Tables and dine-in is set up as a booking module with its own code prefix. */

import { describe, expect, it } from "vitest";
import { tablesDineinModule } from "../src/domain/tables-dinein-module";

describe("Tables and dine-in", () => {
  it("is set up as a booking module", () => {
    expect(tablesDineinModule).toMatchObject({ key: "tables-dinein", prefix: "TB", kinds: ["slot"] });
  });
});
