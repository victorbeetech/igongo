/** Tests which sender is used for which settings, and reading the key file. */

import { describe, expect, it } from "vitest";
import { createPushSender } from "../src/infrastructure/create-push-sender";
import { FcmHttpV1Sender } from "../src/infrastructure/fcm/fcm-http-v1-sender";
import { parseServiceAccount } from "../src/infrastructure/fcm/service-account";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { NotConfiguredPushSender } from "../src/infrastructure/not-configured-push-sender";
import { testServiceAccount } from "./helpers";

describe("createPushSender", () => {
  it("uses the mock when asked", () => {
    expect(createPushSender({ PUSH_SENDER: "mock" })).toBeInstanceOf(MockPushSender);
  });

  it("sends nothing, and says why, with no key", async () => {
    const sender = createPushSender({});
    expect(sender).toBeInstanceOf(NotConfiguredPushSender);
    expect((await sender.sendToTokens(["t1"], {} as never))[0]?.outcome).toBe("not_configured");
  });

  it("uses FCM with a valid key, and not with a broken one", async () => {
    const { account } = await testServiceAccount();
    expect(createPushSender({ FCM_SERVICE_ACCOUNT: JSON.stringify(account) })).toBeInstanceOf(FcmHttpV1Sender);
    expect(createPushSender({ FCM_SERVICE_ACCOUNT: "{not json" })).toBeInstanceOf(NotConfiguredPushSender);
    expect(parseServiceAccount(JSON.stringify({ project_id: "x" }))).toBeNull();
  });
});
