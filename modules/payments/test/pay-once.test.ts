/**
 * Real-user hardening for paying, with a stand-in mobile money provider and
 * an in-memory store: a double tap never charges twice, and a payment whose
 * phone lost signal after paying is still settled (by the provider's
 * callback or by the app asking again), exactly once, never for less.
 */

import type { Payable } from "@igongo/contracts/payments";
import { describe, expect, it } from "vitest";
import type { PaymentProvider, ProviderVerdict } from "../src/application/ports/payment-provider";
import type { PaymentRepository } from "../src/application/ports/payment-repository";
import type { PaymentsDeps } from "../src/application/payments-deps";
import { refreshPayment } from "../src/application/use-cases/settle-payment";
import { startPayment } from "../src/application/use-cases/start-payment";
import { DEFAULT_METHOD_SETTINGS } from "../src/domain/method-settings";
import type { Payment } from "../src/domain/payment";

/** A shop with one 20,000 UGX order for Grace, a fake MTN and memory storage. */
function setUp() {
  const rows = new Map<string, Payment>();
  const repo: PaymentRepository = {
    byId: async (id) => rows.get(id) ?? null,
    forRecord: async (module, recordId) => [...rows.values()].filter((p) => p.module === module && p.recordId === recordId),
    list: async () => [...rows.values()],
    add: async (p) => void rows.set(p.id, { ...p }),
    update: async (p) => void rows.set(p.id, { ...p }),
    // Settles only while pending, like the database's conditional update.
    settle: async (id, status, message, at) => {
      const p = rows.get(id);
      if (!p || p.status !== "pending") return false;
      rows.set(id, { ...p, status, message, settledAt: at });
      return true;
    },
    settlement: async () => [],
  };
  const charges: string[] = [];
  let verdict: ProviderVerdict = { status: "pending", amount: null, message: null };
  const mtn: PaymentProvider = {
    connected: async () => true,
    start: async (c) => (charges.push(c.paymentId), { providerRef: `mtn-${c.paymentId}`, redirectUrl: null, message: "Approve on your phone" }),
    check: async () => verdict,
    trustCallback: async () => true,
    paymentIdIn: () => null,
  };
  const paidCalls: number[] = [];
  const order: Payable = {
    bill: async () => ({ label: "Order F-0001", total: 20_000, paid: paidCalls.reduce((a, b) => a + b, 0), minimumNow: 20_000, payerUserId: "usr_grace", outlet: null }),
    paid: async (_id, amount) => void paidCalls.push(amount),
  };
  const settings = structuredClone(DEFAULT_METHOD_SETTINGS);
  settings.methods.mtn_momo = { enabled: true, outlets: [], modules: [] };
  const deps: PaymentsDeps = {
    payments: repo,
    settings: { read: async () => settings, write: async () => undefined },
    providers: { mtn_momo: mtn },
    payables: { "food-ordering": order },
    change: { actorId: "usr_grace", audit: { record: async () => undefined }, now: new Date("2026-11-26T12:00:00Z") },
    apiBase: "https://api.test",
    webBase: "https://web.test",
  };
  const pay = () =>
    startPayment(deps, {
      ref: { module: "food-ordering", recordId: "ord_1" },
      method: "mtn_momo",
      phone: "0772123456",
      payer: { userId: "usr_grace", name: "Grace", email: "grace@example.com" },
      onBehalf: false,
    });
  return { deps, pay, charges, paidCalls, setVerdict: (v: ProviderVerdict) => (verdict = v) };
}

describe("paying once", () => {
  it("a double tap gets the same payment back and charges once", async () => {
    const t = setUp();
    const first = await t.pay();
    expect((await t.pay()).id).toBe(first.id);
    expect((await t.pay()).id).toBe(first.id);
    expect(t.charges).toEqual([first.id]);
  });

  it("settles a payment after the phone lost signal, once, when the app asks again", async () => {
    const t = setUp();
    const p = await t.pay();
    // The payer approves on their phone, but the app never heard back.
    t.setVerdict({ status: "succeeded", amount: 20_000, message: "Paid" });
    const seen = await refreshPayment(t.deps, (await t.deps.payments.byId(p.id)) as Payment);
    expect(seen.status).toBe("succeeded");
    // The callback and another look arrive later: the order is marked paid only once.
    await refreshPayment(t.deps, (await t.deps.payments.byId(p.id)) as Payment);
    await refreshPayment(t.deps, { ...p });
    expect(t.paidCalls).toEqual([20_000]);
    // Fully paid now, so a new tap is refused rather than charged.
    await expect(t.pay()).rejects.toThrow(/already paid/);
  });

  it("never counts a short payment as paid", async () => {
    const t = setUp();
    const p = await t.pay();
    t.setVerdict({ status: "succeeded", amount: 5_000, message: "Paid" });
    const seen = await refreshPayment(t.deps, p);
    expect(seen.status).toBe("failed");
    expect(t.paidCalls).toEqual([]);
  });
});
