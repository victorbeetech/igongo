/**
 * The guest's own details are checked on the server: names, phones, emails
 * and dates are refused with a sentence, and fields the guest must not set
 * are dropped.
 */

import { describe, expect, it } from "vitest";
import { myDetailsBody } from "../src/presentation/request-schemas";

describe("my details (PATCH /crm/me) schema", () => {
  it("accepts a full, valid set of details", () => {
    const parsed = myDetailsBody.parse({
      name: "  Grace Muhwezi ",
      phone: "+256 700 000000",
      email: "Grace@Example.COM",
      birthday: "1990-05-01",
    });
    // Step 1: the name is trimmed, the email is kept in lower case.
    expect(parsed).toEqual({ name: "Grace Muhwezi", phone: "+256 700 000000", email: "grace@example.com", birthday: "1990-05-01" });
  });

  it("lets null clear phone and email", () => {
    expect(myDetailsBody.parse({ phone: null, email: null })).toEqual({ phone: null, email: null });
  });

  it("refuses a bad email with a sentence", () => {
    const result = myDetailsBody.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toMatch(/email address/);
  });

  it("refuses a phone that is too short or has letters", () => {
    expect(myDetailsBody.safeParse({ phone: "12" }).success).toBe(false);
    expect(myDetailsBody.safeParse({ phone: "0700 abc 000" }).success).toBe(false);
  });

  it("refuses a name that is one letter", () => {
    expect(myDetailsBody.safeParse({ name: "A" }).success).toBe(false);
  });

  it("drops fields a guest may not set on their own profile", () => {
    // Step 1: tags, consent and the account link are not in the schema, so they never reach the use case.
    const parsed = myDetailsBody.parse({ name: "Ada Lovelace", tags: ["vip"], userId: "usr_someone_else", consent: { sms: true } });
    expect(parsed).toEqual({ name: "Ada Lovelace" });
  });
});
