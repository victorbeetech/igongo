/** Venues and equipment is set up as a booking module with its own code prefix. */

import { describe, expect, it } from "vitest";
import { venuesEquipmentModule } from "../src/domain/venues-equipment-module";

describe("Venues and equipment", () => {
  it("is set up as a booking module", () => {
    expect(venuesEquipmentModule).toMatchObject({ key: "venues-equipment", prefix: "VE", kinds: ["slot", "stock", "enquiry"] });
  });
});
