/**
 * Payments HTTP routes, mounted by the gateway at `/api/payments`.
 *
 *   GET   /payments/methods?module&outlet    methods switched on here (S77-01), plus preview ones without keys
 *   GET   /payments/connections              which gateways have their keys saved (super admin)
 *   POST  /payments/pay                      pay a bill in the app (S77-01, S77-02)
 *   POST  /payments/record                   staff record a till payment (S77-08)
 *   GET   /payments?status&module&mine       payments list (S77-04), or mine
 *   GET   /payments/for/:module/:recordId    payments of one order or booking
 *   GET   /payments/:id                      one payment, re-checked with the provider (S77-03)
 *   POST  /payments/:id/refund               refund, through the provider when it can (S77-05)
 *   GET   /payments/settlement?from&to       money in by day, method, module, outlet (S77-07)
 *   GET   /payments/settlement.csv?from&to   the same as a spreadsheet
 *   POST  /payments/callbacks/:method/:id?   provider callbacks (no sign-in; verified)
 *   GET|PUT /payments/settings               method switches (S77-06)
 */

import { zValidator } from "@hono/zod-validator";
import { PAYMENT_METHODS, type PaymentMethod } from "@igongo/contracts/payments";
import { actorOf, AppError, canForOthers, recordChange, requirePermission, requireSignIn, requireStaffPermission, toCsv, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { PaymentsDeps } from "../application/payments-deps";
import { recordManualPayment } from "../application/use-cases/record-manual-payment";
import { refundPayment } from "../application/use-cases/refund-payment";
import { refreshPayment } from "../application/use-cases/settle-payment";
import { startPayment } from "../application/use-cases/start-payment";
import { METHOD_CATALOG } from "../domain/method-catalog";
import { methodAllowed } from "../domain/method-settings";
import type { Payment } from "../domain/payment";
import { PAYMENT_PERMISSIONS as P } from "./permissions";
import { listQuery, methodsQuery, payBody, recordBody, refundBody, settingsBody, settlementQuery } from "./request-schemas";

/** Hotel days [from] to [to] (included) as a time range; Kampala is UTC+3 all year. */
function dayRange(from: string, to: string): [Date, Date] {
  return [new Date(`${from}T00:00:00+03:00`), new Date(new Date(`${to}T00:00:00+03:00`).getTime() + 86_400_000)];
}

/** True when the caller holds [permission] beyond their own records (staff). */
const isStaffFor = (c: Context<ActorEnv>, permission: string) => canForOthers(actorOf(c), permission);

/** @throws AppError unless [payment] is the caller's own, or they are staff who may see payments */
function mayRead(c: Context<ActorEnv>, payment: Payment) {
  if (payment.payerUserId !== actorOf(c).userId && !isStaffFor(c, P.view)) throw new AppError("not_found", "Payment not found.");
}

export function paymentsRouter(deps: (c: Context<ActorEnv>) => PaymentsDeps) {
  return new Hono<ActorEnv>()
    .get("/methods", requireSignIn, zValidator("query", methodsQuery), async (c) => {
      const { module, outlet } = c.req.valid("query");
      const settings = await deps(c).settings.read();
      const staff = isStaffFor(c, P.manual);
      // Guests see app methods; till staff also see the ones they record.
      const allowed = PAYMENT_METHODS.filter((m) => methodAllowed(settings, m, module, outlet ?? null))
        .map((m) => METHOD_CATALOG[m])
        .filter((m) => staff || m.kind !== "staff");
      // A gateway switched on but without keys is not usable yet: it moves to the preview list.
      const providers = deps(c).providers;
      const connected = new Map(await Promise.all(Object.entries(providers).map(async ([m, p]) => [m, await p.connected()] as const)));
      const items = allowed.filter((m) => m.kind === "staff" || connected.get(m.method));
      // Preview mode: every gateway still waiting for keys, shown greyed out and labelled, never payable.
      const preview = settings.showPreview ? PAYMENT_METHODS.filter((m) => providers[m] && !connected.get(m)).map((m) => ({ ...METHOD_CATALOG[m], preview: true })) : [];
      return c.json({ items, preview });
    })
    .get("/connections", requireStaffPermission(P.methods), async (c) => {
      const providers = deps(c).providers;
      return c.json(Object.fromEntries(await Promise.all(Object.entries(providers).map(async ([m, p]) => [m, await p.connected()] as const))));
    })
    .post("/pay", requirePermission(P.pay), zValidator("json", payBody), async (c) => {
      const { module, recordId, method, amount, phone } = c.req.valid("json");
      const actor = actorOf(c);
      const payment = await startPayment(deps(c), {
        ref: { module, recordId }, method, ...(amount ? { amount } : {}), ...(phone ? { phone } : {}),
        payer: { userId: actor.userId, name: actor.name, email: actor.email }, onBehalf: isStaffFor(c, P.pay),
      });
      return c.json(payment, 201);
    })
    .post("/record", requireStaffPermission(P.manual), zValidator("json", recordBody), async (c) => {
      const { module, recordId, method, amount, reference } = c.req.valid("json");
      return c.json(await recordManualPayment(deps(c), { ref: { module, recordId }, method, ...(amount ? { amount } : {}), ...(reference ? { reference } : {}) }), 201);
    })
    .get("/", requireSignIn, zValidator("query", listQuery), async (c) => {
      const { status, module, mine } = c.req.valid("query");
      const own = mine === "1" || !isStaffFor(c, P.view);
      return c.json({ items: await deps(c).payments.list({ ...(status ? { status } : {}), ...(module ? { module } : {}), ...(own ? { payerUserId: actorOf(c).userId } : {}), limit: 200 }) });
    })
    .get("/for/:module/:recordId", requireSignIn, async (c) => {
      const items = await deps(c).payments.forRecord(c.req.param("module"), c.req.param("recordId"));
      items.forEach((p) => mayRead(c, p));
      return c.json({ items });
    })
    .get("/settlement", requireStaffPermission(P.reports), zValidator("query", settlementQuery), async (c) => {
      const { from, to } = c.req.valid("query");
      const rows = await deps(c).payments.settlement(...dayRange(from, to));
      return c.json({ from, to, items: rows, total: rows.reduce((n, r) => n + r.net, 0) });
    })
    .get("/settlement.csv", requireStaffPermission(P.reports), zValidator("query", settlementQuery), async (c) => {
      const { from, to } = c.req.valid("query");
      const rows = await deps(c).payments.settlement(...dayRange(from, to));
      const csv = toCsv([["Day", "Method", "Module", "Outlet", "Payments", "Amount", "Refunded", "Net"], ...rows.map((r) => [r.day, r.method, r.module, r.outlet, r.count, r.amount, r.refunded, r.net])]);
      await recordChange(deps(c).change, { module: "payments", action: "settlement.exported", recordType: "settlement", recordId: `${from}..${to}`, summary: `Downloaded the settlement report for ${from} to ${to}` });
      return c.body(csv, 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="settlement-${from}-${to}.csv"` });
    })
    .get("/settings", requireSignIn, async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.methods), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const value = c.req.valid("json");
      await d.settings.write(value, d.change.actorId, d.change.now);
      const on = PAYMENT_METHODS.filter((m) => value.methods[m].enabled).map((m) => METHOD_CATALOG[m].name);
      await recordChange(d.change, { module: "payments", action: "payments.methods_changed", recordType: "settings", recordId: "methods", summary: `Payment methods on: ${on.join(", ") || "none"} (${value.environment})` });
      return c.json(value);
    })
    .get("/:id", requireSignIn, async (c) => {
      const d = deps(c);
      const payment = await d.payments.byId(c.req.param("id"));
      if (!payment) throw new AppError("not_found", "Payment not found.");
      mayRead(c, payment);
      // While the payer waits on the prompt, each look asks the provider again.
      return c.json(await refreshPayment(d, payment));
    })
    .post("/:id/refund", requireStaffPermission(P.refund), zValidator("json", refundBody), async (c) => {
      const { amount, reason } = c.req.valid("json");
      return c.json(await refundPayment(deps(c), c.req.param("id"), amount, reason));
    })
    .on(["POST", "PUT"], "/callbacks/:method/:id?", async (c) => {
      // Providers call without a session. Nothing here is trusted: the
      // payment is looked up by our own ID and its status asked of the provider.
      const method = c.req.param("method") as PaymentMethod;
      const d = deps(c);
      const provider = d.providers[method];
      if (!provider || !(await provider.trustCallback(c.req.raw.headers))) return c.json({ ok: false }, 401);
      const body: unknown = await c.req.json().catch(() => null);
      const id = c.req.param("id") ?? provider.paymentIdIn(body);
      const payment = id ? await d.payments.byId(id) : null;
      if (!payment || payment.method !== method) return c.json({ ok: false }, 404);
      const now = await refreshPayment(d, payment);
      return c.json({ ok: true, status: now.status });
    });
}
