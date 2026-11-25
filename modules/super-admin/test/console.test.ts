/** The Super Admin Console on PGlite with its real migrations. */

import { describe, expect, it } from "vitest";
import type { AuditEntryInput } from "@igongo/contracts/audit-trail";
import { SecretBox, toBase64 } from "@igongo/core";
import { DrizzleConsoleStore, listModules, moduleSwitchReader, readSection, secretReader, setModuleState } from "../src";
import { listSecrets, setSecret } from "../src/application/use-cases/secrets";
import { updateSection } from "../src/application/use-cases/settings";
import { freshDb } from "./helpers";

async function setup() {
  const { db, client } = await freshDb();
  const audit: AuditEntryInput[] = [];
  const ctx = { actorId: "admin", audit: { record: async (e: AuditEntryInput) => void audit.push(e) }, now: new Date() };
  return { store: new DrizzleConsoleStore(db), client, audit, ctx };
}

describe("module switches", () => {
  it("lists all 84 modules on, switches one off, and keeps core modules on", async () => {
    const { store, ctx, audit } = await setup();
    expect(await listModules(store)).toHaveLength(84);
    await setModuleState(store, ctx, "pool", { enabled: false, message: "Closed for cleaning" });
    expect(await moduleSwitchReader(store).stateOf("pool")).toMatchObject({ enabled: false, message: "Closed for cleaning" });
    await expect(setModuleState(store, ctx, "audit-trail", { enabled: false })).rejects.toThrow(/cannot be switched off/);
    expect(audit[0]?.action).toBe("module.disabled");
  });
});

describe("settings", () => {
  it("merges saved values over defaults and refuses bad values", async () => {
    const { store, ctx } = await setup();
    expect((await readSection(store, "regional"))["currency"]).toBe("UGX");
    await updateSection(store, ctx, "branding", { announcement: "Pool closed today" });
    expect((await readSection(store, "branding"))["announcement"]).toBe("Pool closed today");
    await expect(updateSection(store, ctx, "regional", { currency: "shillings" })).rejects.toThrow(/currency/);
  });
});

describe("encrypted keys", () => {
  it("stores keys encrypted, lists only the last four, and reads them back on the server", async () => {
    const { store, ctx, client, audit } = await setup();
    const box = await SecretBox.fromBase64Key(toBase64(crypto.getRandomValues(new Uint8Array(32))));
    await setSecret(store, box, ctx, "google.client_secret", "GOCSPX-demo-1234");
    const raw = await client.query<{ sealed: string }>("select sealed from super_admin.secrets");
    expect(raw.rows[0]?.sealed).not.toContain("demo");
    const listed = (await listSecrets(store)).find((s) => s.key === "google.client_secret");
    expect(listed).toMatchObject({ isSet: true, lastFour: "1234" });
    expect(await secretReader(store, box).get("google.client_secret")).toBe("GOCSPX-demo-1234");
    expect(JSON.stringify(audit)).not.toContain("demo");
    await expect(setSecret(store, box, ctx, "Bad Key", "x")).rejects.toThrow(/provider.field/);
  });
});
