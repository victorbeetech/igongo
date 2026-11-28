/**
 * Tests for the points use cases on the in-memory store: earning, the
 * switch, spending, the minimum, retries, expiry and manual adjustments.
 */

import { AppError } from "@igongo/core";
import { describe, expect, it } from "vitest";
import { adjustPoints } from "../src/application/use-cases/adjust";
import { expireDue } from "../src/application/use-cases/expire";
import { earnForPurchase, grantSignupBonus } from "../src/application/use-cases/earn";
import { redeemPoints } from "../src/application/use-cases/redeem";
import { saveRules } from "../src/application/use-cases/rules";
import { walletFor } from "../src/application/use-cases/wallet";
import { DEFAULT_POINTS_RULES } from "../src/domain/rules";
import { FakePointsStore, fakeDeps, NOW } from "./fake-points-store";

const DAY = 24 * 60 * 60 * 1000;
/** Rules switched on with easy numbers: 1 point per 1,000 UGX, 10 UGX a point, 5 minimum. */
const ON = { ...DEFAULT_POINTS_RULES, enabled: true, minimumToRedeem: 5, expiryDays: 365 };

/** A store with the programme switched on. */
function onStore(rules = ON): FakePointsStore {
  const store = new FakePointsStore();
  store.rules = { ...rules };
  return store;
}

describe("earning", () => {
  it("earns nothing and writes nothing while the programme is off", async () => {
    const deps = fakeDeps(NOW);
    expect(await earnForPurchase(deps, { guestId: "g", amountUgx: 50000, orderRef: "A" })).toBe(0);
    expect(deps.store.commits).toBe(0);
  });

  it("earns points on a paid order and gives a lot that expires later", async () => {
    const deps = fakeDeps(NOW, onStore());
    expect(await earnForPurchase(deps, { guestId: "g", amountUgx: 12000, orderRef: "A" })).toBe(12);
    expect(deps.store.lots[0]?.expiresAt?.getTime()).toBe(NOW.getTime() + 365 * DAY);
  });

  it("gives the same order's points only once when the call is retried", async () => {
    const deps = fakeDeps(NOW, onStore());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 12000, orderRef: "A" });
    expect(await earnForPurchase(deps, { guestId: "g", amountUgx: 12000, orderRef: "A" })).toBe(0);
    expect(deps.store.lots).toHaveLength(1);
  });

  it("gives the sign-up bonus once", async () => {
    const deps = fakeDeps(NOW, onStore({ ...ON, signupBonus: 50 }));
    expect(await grantSignupBonus(deps, "g")).toBe(50);
    expect(await grantSignupBonus(deps, "g")).toBe(0);
  });
});

describe("the wallet", () => {
  it("shows the guest nothing while the programme is off", async () => {
    expect(await walletFor(fakeDeps(NOW), "g", NOW)).toEqual({ enabled: false });
  });

  it("shows the balance, its value and the points expiring soon", async () => {
    const store = onStore();
    store.lots.push({ id: "soon", guestId: "g", earned: 20, remaining: 20, earnedAt: NOW, expiresAt: new Date(NOW.getTime() + 10 * DAY), sourceRef: "s1" });
    store.lots.push({ id: "later", guestId: "g", earned: 30, remaining: 30, earnedAt: NOW, expiresAt: new Date(NOW.getTime() + 300 * DAY), sourceRef: "s2" });
    const wallet = await walletFor(fakeDeps(NOW, store), "g", NOW);
    expect(wallet).toMatchObject({ enabled: true, balance: 50, valueUgx: 500, minimumToRedeem: 5 });
    if (wallet.enabled) expect(wallet.expiringSoon?.points).toBe(20);
  });
});

describe("spending", () => {
  it("refuses while the programme is off", async () => {
    await expect(redeemPoints(fakeDeps(NOW), { guestId: "g", points: 10, orderRef: "A" })).rejects.toBeInstanceOf(AppError);
  });

  it("refuses an amount under the minimum", async () => {
    const deps = fakeDeps(NOW, onStore());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 50000, orderRef: "A" });
    await expect(redeemPoints(deps, { guestId: "g", points: 4, orderRef: "B" })).rejects.toMatchObject({ code: "bad_request" });
  });

  it("refuses when the guest does not have enough", async () => {
    const deps = fakeDeps(NOW, onStore());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 5000, orderRef: "A" });
    await expect(redeemPoints(deps, { guestId: "g", points: 6, orderRef: "B" })).rejects.toMatchObject({ code: "bad_request" });
  });

  it("spends the points and reports their value", async () => {
    const deps = fakeDeps(NOW, onStore());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "A" });
    const result = await redeemPoints(deps, { guestId: "g", points: 10, orderRef: "B" });
    expect(result).toEqual({ points: 10, valueUgx: 100, applied: true });
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 10 });
  });

  it("does not spend twice when the same order is retried", async () => {
    const deps = fakeDeps(NOW, onStore());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "A" });
    await redeemPoints(deps, { guestId: "g", points: 10, orderRef: "B" });
    const again = await redeemPoints(deps, { guestId: "g", points: 10, orderRef: "B" });
    expect(again.applied).toBe(false);
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 10 });
  });
});

describe("expiry", () => {
  it("expires overdue lots once, with a history line", async () => {
    const store = onStore();
    store.lots.push({ id: "old", guestId: "g", earned: 40, remaining: 40, earnedAt: NOW, expiresAt: new Date(NOW.getTime() - DAY), sourceRef: "s1" });
    const deps = fakeDeps(NOW, store);
    expect(await expireDue(deps)).toEqual({ lots: 1, points: 40 });
    expect(store.lots[0]?.remaining).toBe(0);
    expect(store.events.find((e) => e.kind === "expire")?.points).toBe(-40);
    expect(await expireDue(deps)).toEqual({ lots: 0, points: 0 });
  });
});

describe("manual adjustment", () => {
  it("adds points with a note, and applies a repeated key once", async () => {
    const deps = fakeDeps(NOW, onStore());
    expect(await adjustPoints(deps, { guestId: "g", points: 30, note: "Apology for delay", key: "adjust-key-1" })).toBe(true);
    expect(await adjustPoints(deps, { guestId: "g", points: 30, note: "Apology for delay", key: "adjust-key-1" })).toBe(false);
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 30 });
  });

  it("refuses to take away more than the guest has", async () => {
    const deps = fakeDeps(NOW, onStore());
    await expect(adjustPoints(deps, { guestId: "g", points: -5, note: "Mistake", key: "adjust-key-2" })).rejects.toMatchObject({ code: "bad_request" });
  });
});

describe("saving rules", () => {
  it("saves every rule and keeps the switch", async () => {
    const deps = fakeDeps(NOW);
    await saveRules(deps, ON);
    expect(deps.store.rules.enabled).toBe(true);
  });
});
