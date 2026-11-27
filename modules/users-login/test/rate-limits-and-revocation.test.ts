/**
 * Pure checks (no database) for two security rules:
 * 1. every path that starts a sign-in or sends a code has a request limit;
 * 2. a session of an account that is not active is ended on its next request.
 */

import { describe, expect, it } from "vitest";
import { DEFAULT_LOGIN_POLICY } from "../src/domain/login-policy";
import { RATE_LIMIT_RULES, ruleFor, SIGN_IN_PATHS } from "../src/domain/rate-limit-rules";
import { requestGate } from "../src/domain/request-gate";

describe("sign-in paths are rate limited", () => {
  it("covers every sign-in and code path with a rule", () => {
    const uncovered = SIGN_IN_PATHS.filter((path) => ruleFor(path) === null);
    expect(uncovered).toEqual([]);
  });

  it("uses the tight limits for the second step and the email and reset paths", () => {
    expect(ruleFor("/two-factor/verify-totp")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/two-factor/verify-backup-code")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/email-otp/send-verification-otp")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/magic-link/verify")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/request-password-reset")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/reset-password")).toEqual({ window: 60, max: 5 });
  });

  it("keeps the older limits for password, social and phone sign-in", () => {
    expect(ruleFor("/sign-in/email")).toEqual({ window: 60, max: 10 });
    expect(ruleFor("/sign-in/social")).toEqual({ window: 60, max: 10 });
    expect(ruleFor("/phone-number/send-otp")).toEqual({ window: 60, max: 5 });
    expect(ruleFor("/pin/sign-in")).toEqual({ window: 60, max: 10 });
  });

  it("gives no rule to paths that are not sign-ins", () => {
    expect(ruleFor("/api/users/me")).toBeNull();
    expect(ruleFor("/health")).toBeNull();
  });

  it("prefers the exact path, then the longest pattern", () => {
    const rules = { "/a/*": { window: 60, max: 1 }, "/a/b/*": { window: 60, max: 2 }, "/a/b/c": { window: 60, max: 3 } };
    expect(ruleFor("/a/b/c", rules)?.max).toBe(3);
    expect(ruleFor("/a/b/d", rules)?.max).toBe(2);
    expect(ruleFor("/a/x", rules)?.max).toBe(1);
  });

  it("has a window and a maximum for every rule", () => {
    for (const rule of Object.values(RATE_LIMIT_RULES)) {
      expect(rule.window).toBeGreaterThan(0);
      expect(rule.max).toBeGreaterThan(0);
    }
  });
});

describe("the request gate ends sessions of accounts that are not active", () => {
  const now = new Date("2026-11-27T12:00:00Z");
  const base = { surface: "app" as const, path: "/api/users/me", account: { kind: "client", email: "ann@example.com", twoFactorEnabled: false, status: "active" }, roleKeys: [], hasStaffRole: false, sessionCreatedAt: now, now, ownerSettingUp: false };

  it("refuses and ends the session of a suspended, locked or pending account", () => {
    for (const status of ["suspended", "locked", "pending", ""]) {
      expect(requestGate({ ...base, account: { ...base.account, status } }, DEFAULT_LOGIN_POLICY)).toEqual({
        allow: false,
        status: 401,
        code: "account_not_active",
        message: "This account is not active. Please contact the hotel.",
        endSession: true,
      });
    }
  });

  it("lets an active account through", () => {
    expect(requestGate(base, DEFAULT_LOGIN_POLICY)).toEqual({ allow: true });
  });
});
