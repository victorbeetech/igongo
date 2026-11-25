/** Tests the real FCM sender against a fake Google: JWT signing, caching, sending and error mapping. */

import { beforeEach, describe, expect, it } from "vitest";
import { FcmHttpV1Sender } from "../src/infrastructure/fcm/fcm-http-v1-sender";
import { clearAccessTokenCache } from "../src/infrastructure/fcm/google-access-token";
import { fromBase64url, samplePayload, testServiceAccount } from "./helpers";

/** A fake Google: checks the JWT, then answers sends per token. */
function fakeGoogle(publicKey: CryptoKey, answers: Record<string, { status: number; body: unknown }>) {
  const calls: { url: string; body: string }[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = String(init?.body ?? "");
    calls.push({ url, body });
    if (url.startsWith("https://oauth2.googleapis.com/token")) {
      // Verify the signed JWT exactly as Google would.
      const assertion = new URLSearchParams(body).get("assertion") ?? "";
      const [header, claims, signature] = assertion.split(".") as [string, string, string];
      const valid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        publicKey,
        fromBase64url(signature),
        new TextEncoder().encode(`${header}.${claims}`),
      );
      const scope = JSON.parse(new TextDecoder().decode(fromBase64url(claims))).scope;
      if (!valid || scope !== "https://www.googleapis.com/auth/firebase.messaging") return new Response("{}", { status: 401 });
      return Response.json({ access_token: "access-1", expires_in: 3600 });
    }
    const message = JSON.parse(body).message;
    const answer = answers[message.token ?? `topic:${message.topic}`] ?? { status: 200, body: { name: "projects/igongo-test/messages/1" } };
    return Response.json(answer.body, { status: answer.status });
  }) as typeof fetch;
  return { fetcher, calls };
}

describe("FcmHttpV1Sender", () => {
  beforeEach(() => clearAccessTokenCache());

  it("signs in once and sends one message per token", async () => {
    const { account, publicKey } = await testServiceAccount();
    const google = fakeGoogle(publicKey, {});
    const results = await new FcmHttpV1Sender(account, google.fetcher).sendToTokens(["t1", "t2", "t3"], samplePayload);

    expect(results.map((r) => r.outcome)).toEqual(["sent", "sent", "sent"]);
    const sends = google.calls.filter((c) => c.url.includes("messages:send"));
    expect(sends).toHaveLength(3);
    expect(sends[0]?.url).toBe("https://fcm.googleapis.com/v1/projects/igongo-test/messages:send");
    // The access token is reused, not fetched per message.
    expect(google.calls.filter((c) => c.url.includes("oauth2"))).toHaveLength(1);
    await new FcmHttpV1Sender(account, google.fetcher).sendToTokens(["t4"], samplePayload);
    expect(google.calls.filter((c) => c.url.includes("oauth2"))).toHaveLength(1);
  });

  it("builds the message the app expects", async () => {
    const { account, publicKey } = await testServiceAccount();
    const google = fakeGoogle(publicKey, {});
    await new FcmHttpV1Sender(account, google.fetcher).sendToTokens(["t1"], samplePayload);
    const message = JSON.parse(google.calls.at(-1)?.body ?? "{}").message;

    expect(message.notification).toEqual({ title: "Fault reported", body: "Room 12: no hot water" });
    expect(message.data).toEqual({ notificationId: "n1", channel: "urgent", link: "/faults/12" });
    expect(message.android).toEqual({ priority: "high", notification: { channel_id: "urgent", icon: "ic_stat_igongo" } });
  });

  it("marks dead tokens and keeps others on plain failures", async () => {
    const { account, publicKey } = await testServiceAccount();
    const google = fakeGoogle(publicKey, {
      gone: { status: 404, body: { error: { status: "NOT_FOUND", message: "Requested entity was not found.", details: [{ errorCode: "UNREGISTERED" }] } } },
      moved: { status: 403, body: { error: { status: "PERMISSION_DENIED", details: [{ errorCode: "SENDER_ID_MISMATCH" }] } } },
      busy: { status: 429, body: { error: { status: "RESOURCE_EXHAUSTED", details: [{ errorCode: "QUOTA_EXCEEDED" }] } } },
    });
    const results = await new FcmHttpV1Sender(account, google.fetcher).sendToTokens(["gone", "moved", "busy", "ok"], samplePayload);
    expect(results.map((r) => r.outcome)).toEqual(["invalid_token", "invalid_token", "failed", "sent"]);
  });

  it("sends to a topic", async () => {
    const { account, publicKey } = await testServiceAccount();
    const google = fakeGoogle(publicKey, {});
    const result = await new FcmHttpV1Sender(account, google.fetcher).sendToTopic("staff", samplePayload);
    expect(result).toMatchObject({ target: "topic:staff", outcome: "sent" });
  });

  it("reports a failure, without throwing, when Google refuses the key", async () => {
    const { account } = await testServiceAccount();
    const other = await testServiceAccount();
    const google = fakeGoogle(other.publicKey, {});
    const [result] = await new FcmHttpV1Sender(account, google.fetcher).sendToTokens(["t1"], samplePayload);
    expect(result?.outcome).toBe("failed");
  });
});
