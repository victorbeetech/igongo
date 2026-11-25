/** Shared test helpers: a real RSA test key and a sample push. */

import type { PushPayload } from "../src/domain/push-payload";
import type { ServiceAccount } from "../src/infrastructure/fcm/service-account";

/** A sample push. */
export const samplePayload: PushPayload = {
  notificationId: "n1",
  title: "Fault reported",
  body: "Room 12: no hot water",
  channel: "urgent",
  link: "/faults/12",
};

/** A fresh RSA key pair and a fake service account that uses it. */
export async function testServiceAccount(): Promise<{ account: ServiceAccount; publicKey: CryptoKey }> {
  const pair = (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const der = new Uint8Array((await crypto.subtle.exportKey("pkcs8", pair.privateKey)) as ArrayBuffer);
  const pem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...der))}\n-----END PRIVATE KEY-----\n`;
  return {
    account: {
      project_id: "igongo-test",
      client_email: `push-${crypto.randomUUID()}@igongo-test.iam.gserviceaccount.com`,
      private_key: pem,
      token_uri: "https://oauth2.googleapis.com/token",
    },
    publicKey: pair.publicKey,
  };
}

/** Decodes a base64url string to bytes. */
export function fromBase64url(text: string): Uint8Array<ArrayBuffer> {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
