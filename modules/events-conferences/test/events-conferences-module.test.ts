/** Events & Conferences sells only slot and enquiry offerings, with its own code prefix. */

import { describe, expect, it } from "vitest";
import { eventsConferencesModule } from "../src/domain/events-conferences-module";

describe("Events & Conferences", () => {
  it("is set up as a booking module", () => {
    expect(eventsConferencesModule).toMatchObject({ key: "events-conferences", prefix: "EV", kinds: ["slot", "enquiry"] });
  });
});
