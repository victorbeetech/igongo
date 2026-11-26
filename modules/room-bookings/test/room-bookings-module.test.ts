/** Room Bookings sells only nights offerings, with its own code prefix. */

import { describe, expect, it } from "vitest";
import { roomBookingsModule } from "../src/domain/room-bookings-module";

describe("Room Bookings", () => {
  it("is set up as a booking module", () => {
    expect(roomBookingsModule).toMatchObject({ key: "room-bookings", prefix: "RB", kinds: ["nights"] });
  });
});
