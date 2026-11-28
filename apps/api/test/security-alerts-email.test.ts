// Security alerts go to the person by email (through Resend) and always as a push.
// Mocked: no real email or push is sent.

import { describe, expect, it, vi } from "vitest";
import { AppError, type Logger } from "@igongo/core";
import type { CodeSender } from "@igongo/users-login";
import { securityAlerts } from "../src/wiring/security-alerts";

const logger = { log: vi.fn() } as unknown as Logger;
const access = { holdersOf: async () => ["admin-1"] } as never;
const person = { userId: "user-1", email: "guest@example.com" };

function sender(ready: boolean, send = vi.fn(async () => undefined)): CodeSender {
  return { send, ready: async () => ready } as unknown as CodeSender;
}

describe("security alerts by email", () => {
  it("emails the person and pushes to their phones when email is set up", async () => {
    const email = sender(true);
    const push = vi.fn(async () => undefined);
    await securityAlerts(email, push, access, logger).toPerson(person, "Google was linked to your account");
    expect(email.send).toHaveBeenCalledWith("email", "guest@example.com", "Google was linked to your account");
    expect(push).toHaveBeenCalledWith(["user-1"], expect.objectContaining({ channel: "urgent" }));
  });

  it("still pushes, and does not fail the sign-in, when email is not set up", async () => {
    const email = sender(false, vi.fn(async () => { throw new AppError("not_configured", "Email is not set up yet."); }));
    const push = vi.fn(async () => undefined);
    await expect(securityAlerts(email, push, access, logger).toPerson(person, "x")).resolves.toBeUndefined();
    expect(push).toHaveBeenCalledTimes(1);
  });
});
