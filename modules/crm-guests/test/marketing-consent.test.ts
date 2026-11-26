/** CRM's consent default: every marketing channel is off until the guest opts in. */

import { describe, expect, it } from "vitest";
import { NO_CONSENT } from "../src/domain/marketing-consent";

describe("marketing consent", () => {
  it("starts with nothing allowed", () => {
    expect(NO_CONSENT).toEqual({ sms: false, whatsapp: false, email: false, changedAt: null });
  });
});
