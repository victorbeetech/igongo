/**
 * The password minimum the owner asked for: 8 characters by default, with
 * the existing letter-and-number rule unchanged. Pure checks, no database.
 */

import { describe, expect, it } from "vitest";
import { DEFAULT_LOGIN_POLICY } from "../src/domain/login-policy";
import { passwordProblem } from "../src/domain/password-rules";

describe("the password minimum", () => {
  it("is 8 characters by default", () => {
    expect(DEFAULT_LOGIN_POLICY.passwordMinLength).toBe(8);
  });

  it("refuses 7 characters and accepts exactly 8 (with a letter and a number)", () => {
    expect(passwordProblem("abcdef1", DEFAULT_LOGIN_POLICY)).toBe("Passwords need at least 8 characters.");
    expect(passwordProblem("abcdef12", DEFAULT_LOGIN_POLICY)).toBeNull();
  });

  it("still needs a letter and a number", () => {
    expect(passwordProblem("abcdefgh", DEFAULT_LOGIN_POLICY)).toBe("Passwords need at least one letter and one number.");
    expect(passwordProblem("12345678", DEFAULT_LOGIN_POLICY)).toBe("Passwords need at least one letter and one number.");
  });
});
