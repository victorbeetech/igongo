/**
 * The guest's profile routes, run through Hono with fake storage. These tests
 * prove that a guest can only read and change their own profile, that bad
 * values get a readable 400, and that staff-only fields are ignored.
 */

import { AppError, type ActorEnv } from "@igongo/core";
import type { Actor } from "@igongo/contracts/users-login";
import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { CrmDeps } from "../src/application/crm-deps";
import type { CrmSettingsStore } from "../src/application/ports/crm-settings-store";
import type { ProfileRepository } from "../src/application/ports/profile-repository";
import type { GuestProfile } from "../src/domain/guest-profile";
import { NO_CONSENT } from "../src/domain/marketing-consent";
import { crmRouter } from "../src/presentation/crm-router";

/** An in-memory profile store, keyed by profile ID. */
function fakeProfiles(): ProfileRepository & { all: Map<string, GuestProfile> } {
  const all = new Map<string, GuestProfile>();
  return {
    all,
    byUserId: async (userId) => [...all.values()].find((p) => p.userId === userId) ?? null,
    byId: async (id) => all.get(id) ?? null,
    byUserIds: async (ids) => [...all.values()].filter((p) => p.userId && ids.includes(p.userId)),
    search: async () => [...all.values()],
    save: async (profile) => {
      all.set(profile.id, { ...profile });
    },
    notes: async () => [],
    addNote: async () => undefined,
  };
}

/** A profile for [userId], as the app would have made it on first visit. */
function profileFor(userId: string, name: string): GuestProfile {
  const now = new Date("2026-11-27T06:00:00Z");
  return {
    id: `gst_${userId}`,
    userId,
    name,
    email: null,
    phone: null,
    nationality: null,
    birthday: null,
    preferences: null,
    allergies: null,
    tags: [],
    consent: NO_CONSENT,
    createdAt: now,
    updatedAt: now,
  };
}

/** A signed-in caller. Only the fields the routes read are filled in. */
function actorFor(userId: string): Actor {
  return { userId, sessionId: `ses_${userId}`, name: `Guest ${userId}`, email: `${userId}@example.com`, access: {} as Actor["access"] };
}

describe("guest profile routes", () => {
  let profiles: ReturnType<typeof fakeProfiles>;
  let app: Hono<ActorEnv>;

  beforeEach(() => {
    profiles = fakeProfiles();
    profiles.all.set("gst_usr_a", profileFor("usr_a", "Ada Guest"));
    profiles.all.set("gst_usr_b", profileFor("usr_b", "Bob Guest"));
    // The audit recorder just counts; the real one writes the audit trail.
    const audit: AuditRecorder = { record: async () => undefined };
    const deps: CrmDeps = {
      profiles,
      settings: {} as CrmSettingsStore, // not used by the guest routes
      change: { actorId: null, audit, now: new Date("2026-11-27T06:00:00Z") },
    };
    // The test stands in for the API shell: it sets the caller from a header and turns AppError into JSON.
    app = new Hono<ActorEnv>();
    app.use("*", async (c, next) => {
      const who = c.req.header("x-test-user");
      if (who) c.set("actor", actorFor(who));
      c.set("requestId", "test");
      await next();
    });
    app.onError((err, c) => {
      if (err instanceof AppError) return c.json({ error: err.code, message: err.message }, err.status as 400);
      return c.json({ error: "internal_error" }, 500);
    });
    app.route("/api/crm", crmRouter(() => deps));
  });

  const patch = (user: string | null, body: unknown) =>
    app.request("/api/crm/me", {
      method: "PATCH",
      headers: { "content-type": "application/json", ...(user ? { "x-test-user": user } : {}) },
      body: JSON.stringify(body),
    });

  it("refuses a guest who is not signed in", async () => {
    const res = await app.request("/api/crm/me");
    expect(res.status).toBe(401);
  });

  it("saves name, phone and email on my own profile only", async () => {
    const res = await patch("usr_a", { name: "Ada Guest", phone: "+256 700 000000", email: "Ada@Example.com" });
    expect(res.status).toBe(200);
    const mine = profiles.all.get("gst_usr_a");
    expect(mine).toMatchObject({ name: "Ada Guest", phone: "+256 700 000000", email: "ada@example.com" });
    // Step 2: the other guest's profile is untouched.
    expect(profiles.all.get("gst_usr_b")).toMatchObject({ name: "Bob Guest", phone: null, email: null });
  });

  it("gives a readable 400 for a bad email and changes nothing", async () => {
    const res = await patch("usr_a", { email: "ada at example" });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; message: string };
    expect(body.error).toBe("bad_request");
    expect(body.message).toMatch(/email address/);
    expect(profiles.all.get("gst_usr_a")?.email).toBeNull();
  });

  it("refuses a phone with letters in it", async () => {
    const res = await patch("usr_a", { phone: "call me" });
    expect(res.status).toBe(400);
  });

  it("ignores tags, consent and the account link sent in the body", async () => {
    const res = await patch("usr_a", { name: "Ada Guest", tags: ["vip"], userId: "usr_b", consent: { sms: true, whatsapp: true, email: true } });
    expect(res.status).toBe(200);
    const mine = profiles.all.get("gst_usr_a");
    expect(mine?.tags).toEqual([]);
    expect(mine?.userId).toBe("usr_a");
    expect(mine?.consent).toEqual(NO_CONSENT);
  });

  it("clears my email when I send null", async () => {
    profiles.all.set("gst_usr_a", { ...profileFor("usr_a", "Ada Guest"), email: "ada@example.com" });
    const res = await patch("usr_a", { email: null });
    expect(res.status).toBe(200);
    expect(profiles.all.get("gst_usr_a")?.email).toBeNull();
  });

  it("shows each guest only their own profile", async () => {
    const res = await app.request("/api/crm/me", { headers: { "x-test-user": "usr_b" } });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ userId: "usr_b", name: "Bob Guest" });
  });
});
