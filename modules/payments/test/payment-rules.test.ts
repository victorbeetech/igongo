/**
 * Payments' pure rules and a provider adapter against a fake MTN:
 * phone numbers, method switches, and that MoMo asks MTN for the status.
 */

import { describe, expect, it } from "vitest";
import { DEFAULT_METHOD_SETTINGS, methodAllowed } from "../src/domain/method-settings";
import { toMsisdn } from "../src/domain/uganda-phone";
import { mtnMomoProvider } from "../src/infrastructure/providers/mtn-momo-provider";

describe("mobile money numbers", () => {
  it("reads the ways people type Ugandan numbers", () => {
    expect(toMsisdn("0772 123 456")).toBe("256772123456");
    expect(toMsisdn("+256 701 234567")).toBe("256701234567");
    expect(toMsisdn("12345")).toBeNull();
  });
});

describe("method switches", () => {
  it("is only cash until the super admin turns methods on, then limits by outlet", () => {
    expect(methodAllowed(DEFAULT_METHOD_SETTINGS, "cash", "food-ordering", null)).toBe(true);
    expect(methodAllowed(DEFAULT_METHOD_SETTINGS, "mtn_momo", "food-ordering", null)).toBe(false);
    const momo = { ...DEFAULT_METHOD_SETTINGS, methods: { ...DEFAULT_METHOD_SETTINGS.methods, mtn_momo: { enabled: true, outlets: ["pool-bar"], modules: [] } } };
    expect(methodAllowed(momo, "mtn_momo", "food-ordering", "pool-bar")).toBe(true);
    expect(methodAllowed(momo, "mtn_momo", "food-ordering", "main")).toBe(false);
  });
});

describe("MTN MoMo adapter", () => {
  const keys = { get: async (k: string) => `key-${k}` };
  it("asks for a token, then reads the status from MTN", async () => {
    const calls: string[] = [];
    const fake = async (url: string) => {
      calls.push(url);
      return new Response(JSON.stringify(url.endsWith("/token/") ? { access_token: "t" } : { status: "SUCCESSFUL", amount: "5000" }), { status: 200 });
    };
    const verdict = await mtnMomoProvider(keys, async () => "sandbox", fake).check("ref-1", "pay_1");
    expect(verdict).toMatchObject({ status: "succeeded", amount: 5000 });
    expect(calls).toEqual(["https://sandbox.momodeveloper.mtn.com/collection/token/", "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/ref-1"]);
  });
  it("says which keys are missing", async () => {
    const none = { get: async () => null };
    await expect(mtnMomoProvider(none, async () => "live", fetch).check("r", "p")).rejects.toThrow(/mtn_momo.api_user/);
  });
});
