/** Tests for checkout: valuing points, and putting back what a cancelled order took or earned. */

import { AppError } from "@igongo/core";
import { describe, expect, it } from "vitest";
import { earnForPurchase } from "../src/application/use-cases/earn";
import { pointsValue, reverseForOrder } from "../src/application/use-cases/checkout";
import { redeemPoints } from "../src/application/use-cases/redeem";
import { walletFor } from "../src/application/use-cases/wallet";
import { DEFAULT_POINTS_RULES } from "../src/domain/rules";
import { pointsDesk } from "../src/infrastructure/points-desk";
import { FakePointsStore, fakeDeps, NOW } from "./fake-points-store";

const ON = { ...DEFAULT_POINTS_RULES, enabled: true, minimumToRedeem: 5, ugxPerPoint: 10 };

/** A store with the programme on and a guest who spent 20,000 UGX (20 points). */
function guestWith20(): FakePointsStore {
  const store = new FakePointsStore();
  store.rules = { ...ON };
  return store;
}

describe("pointsValue", () => {
  it("values points at the shillings rate", async () => {
    expect(await pointsValue(fakeDeps(NOW, guestWith20()), 10)).toBe(100);
  });

  it("refuses while off, and under the minimum", async () => {
    await expect(pointsValue(fakeDeps(NOW), 10)).rejects.toBeInstanceOf(AppError);
    await expect(pointsValue(fakeDeps(NOW, guestWith20()), 4)).rejects.toMatchObject({ code: "bad_request" });
  });
});

describe("reverseForOrder", () => {
  it("returns points an order spent, as a new lot, once", async () => {
    const deps = fakeDeps(NOW, guestWith20());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "E" });
    await redeemPoints(deps, { guestId: "g", points: 10, orderRef: "O1" });
    await reverseForOrder(deps, "g", "O1");
    await reverseForOrder(deps, "g", "O1");
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 20 });
  });

  it("takes back points an order earned, once", async () => {
    const deps = fakeDeps(NOW, guestWith20());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "O2" });
    await reverseForOrder(deps, "g", "O2");
    await reverseForOrder(deps, "g", "O2");
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 0 });
  });

  it("takes back no more than the guest still has", async () => {
    const deps = fakeDeps(NOW, guestWith20());
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "O3" });
    await redeemPoints(deps, { guestId: "g", points: 15, orderRef: "Other" });
    await reverseForOrder(deps, "g", "O3");
    expect(await walletFor(deps, "g", NOW)).toMatchObject({ balance: 0 });
  });

  it("still returns spent points while the programme is off", async () => {
    const store = guestWith20();
    const deps = fakeDeps(NOW, store);
    await earnForPurchase(deps, { guestId: "g", amountUgx: 20000, orderRef: "E" });
    await redeemPoints(deps, { guestId: "g", points: 10, orderRef: "O4" });
    store.rules = { ...store.rules, enabled: false };
    await reverseForOrder(deps, "g", "O4");
    const lots = await store.lotsOf("g");
    expect(lots.reduce((s, l) => s + l.remaining, 0)).toBe(20);
  });
});

describe("pointsDesk", () => {
  it("spends and reports the shillings taken off", async () => {
    const deps = fakeDeps(NOW, guestWith20());
    const desk = pointsDesk(deps);
    await desk.earn("g", 20000, "X");
    expect(await desk.spend("g", 10, "Y")).toBe(100);
  });
});
