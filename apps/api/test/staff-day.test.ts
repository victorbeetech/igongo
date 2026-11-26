/**
 * End-to-end test of the staff modules (build step 2) on PGlite: HR enrols
 * a staff member, issues their card, the gate clocks them in with a tap, they
 * write a daily report, eat lunch, read and like a notice, and the events
 * team runs wristbands for a wedding. Checks the permission scopes, the
 * module switches and that everything lands in the Audit Trail.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** Today in the hotel's time zone, as the API counts it. */
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kampala" }).format(new Date());

/**
 * A hotel with a signed-in super admin (who configures but does not run
 * daily work) and an HR manager (who enrols staff), plus a way to make
 * more signed-in staff with pre-made roles.
 */
async function hotel() {
  const t = await testApi();
  // The owner: set-up claimed and 2-step on, as the console requires.
  const owner = await t.owner();

  /** A signed-in staff account holding [roleIds]. */
  async function account(name: string, roleIds: string[]) {
    const email = `${name.toLowerCase()}@example.com`;
    const created = (await owner("POST", "/api/users", { name, email, password: `${name} pass 1234` })).body as { id: string };
    for (const roleId of roleIds) expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId })).status).toBe(204);
    const call = t.browser();
    expect((await call("POST", "/api/auth/sign-in/email", { email, password: `${name} pass 1234` })).status).toBe(200);
    return { call, userId: created.id };
  }

  const hr = await account("Hana", ["role_hr-manager"]);

  /** Like [account], and enrolled by HR in [department] (which adds the staff base role). */
  async function person(name: string, department: string, roleIds: string[] = []) {
    const { call, userId } = await account(name, roleIds);
    const staff = (await hr.call("POST", "/api/hr/staff", { name, department, jobTitle: "Staff", userId })).body as { staffId: string; staffNumber: string };
    expect(staff.staffNumber).toMatch(/^IGG-\d{4}$/);
    return { call, staff, userId };
  }
  return { ...t, owner, hr: hr.call, person };
}

describe("a staff member's day", () => {
  it("enrols, issues a card, clocks in at the gate, reports, eats and reads the board", async () => {
    const { owner, hr, person } = await hotel();
    // HR enrols Sam (kitchen) and the gatekeeper; numbers run on.
    const sam = await person("Sam", "kitchen");
    const gate = await person("Gail", "security", ["role_gatekeeper"]);
    expect(sam.staff.staffNumber).toBe("IGG-0001");
    expect(gate.staff.staffNumber).toBe("IGG-0002");
    expect((await sam.call("GET", "/api/hr/staff/me")).body).toMatchObject({ name: "Sam", department: "kitchen" });
    // The directory is for HR; Sam only sees their own profile.
    expect((await sam.call("GET", "/api/hr/staff")).status).toBe(403);
    expect(((await hr("GET", "/api/hr/staff?q=sam")).body["items"] as unknown[]).length).toBe(1);

    // A blank card into stock, encoded, issued to Sam.
    const card = (await hr("POST", "/api/cards", { uid: "04:a1:b2:c3:d4:e5:f6" })).body as { cardId: string; cardNumber: string; uid: string; qr: string };
    expect(card).toMatchObject({ cardNumber: "C-00001", uid: "04A1B2C3D4E5F6" });
    expect((await hr("POST", `/api/cards/${card.cardId}/issue`, { staffId: sam.staff.staffId })).body).toMatchObject({ status: "active" });
    expect(((await sam.call("GET", "/api/cards/mine")).body["card"] as { cardNumber: string }).cardNumber).toBe("C-00001");
    // Who owns this card? Gatekeepers can ask.
    expect(((await gate.call("POST", "/api/cards/resolve", { qr: card.qr })).body["holder"] as { name: string }).name).toBe("Sam");

    // The gate taps Sam in; a second tap at once is a double tap.
    const tap = await gate.call("POST", "/api/attendance/station-clock", { uid: "04A1B2C3D4E5F6", station: "Main gate" });
    expect(tap.status).toBe(201);
    expect(tap.body).toMatchObject({ event: { kind: "in", method: "nfc", station: "Main gate" }, staff: { name: "Sam" } });
    expect((await gate.call("POST", "/api/attendance/station-clock", { uid: "04A1B2C3D4E5F6", station: "Main gate" })).status).toBe(409);
    // Sam cannot run a station; a gatekeeper cannot correct attendance.
    expect((await sam.call("POST", "/api/attendance/station-clock", { qr: card.qr, station: "Main gate" })).status).toBe(403);
    expect((await sam.call("GET", "/api/attendance/status")).body).toMatchObject({ clockedIn: true });
    // HR switches off the double-tap wait; Sam clocks out from the phone.
    await hr("PUT", "/api/attendance/rules", { dayStartsAt: "08:00", graceMinutes: 10, allowAppClock: true, doubleTapSeconds: 0 });
    expect((await sam.call("POST", "/api/attendance/clock")).body).toMatchObject({ event: { kind: "out", method: "app" } });
    // The owner's board shows both people; Sam's shows only Sam.
    const board = (await hr("GET", "/api/attendance/board")).body as { rows: { staff: { name: string }; state: string }[] };
    expect(board.rows.map((r) => [r.staff.name, r.state]).sort()).toEqual([["Gail", "absent"], ["Sam", "present"]]);
    expect(((await sam.call("GET", "/api/attendance/board")).body["rows"] as unknown[]).length).toBe(1);
    // A correction needs a reason and the edit permission.
    expect((await sam.call("POST", "/api/attendance/corrections", { staffId: sam.staff.staffId, kind: "in", at: new Date().toISOString(), reason: "Forgot my card" })).status).toBe(403);
    expect((await hr("POST", "/api/attendance/corrections", { staffId: sam.staff.staffId, kind: "in", at: new Date(Date.now() - 60000).toISOString(), reason: "Forgot the card at home" })).status).toBe(201);

    const gm = await person("Grace", "management", ["role_general-manager"]);
    const canteen = await person("Cato", "kitchen", ["role_canteen-attendant"]);
    // Daily report: a draft, then sent, then signed by the GM.
    const sections = [{ title: "What I did today", text: "Prepared lunch for 40 guests" }];
    expect((await sam.call("PUT", `/api/daily-reports/mine/${today}`, { sections })).body).toMatchObject({ status: "draft" });
    expect(((await gm.call("GET", `/api/daily-reports/missing?date=${today}`)).body["items"] as { name: string }[]).map((p) => p.name).sort()).toEqual(["Cato", "Gail", "Grace", "Sam"]);
    const sent = (await sam.call("PUT", `/api/daily-reports/mine/${today}`, { sections, submit: true })).body as { id: string; status: string };
    expect(sent.status).toBe("submitted");
    expect((await sam.call("POST", `/api/daily-reports/${sent.id}/review`, { decision: "signed" })).status).toBe(403);
    expect((await gm.call("POST", `/api/daily-reports/${sent.id}/review`, { decision: "signed" })).body).toMatchObject({ status: "signed" });
    expect((await sam.call("PUT", `/api/daily-reports/mine/${today}`, { sections })).status).toBe(409);
    expect((await gm.call("POST", `/api/daily-reports/${sent.id}/comments`, { body: "Well done" })).status).toBe(201);

    // Lunch at the canteen by QR, once only.
    const lunch = await canteen.call("POST", "/api/staff-meals/serve", { qr: card.qr, mealKey: "lunch" });
    expect(lunch.body).toMatchObject({ mealName: "Lunch", staff: { name: "Sam" }, claim: { method: "qr" } });
    expect((await canteen.call("POST", "/api/staff-meals/serve", { qr: card.qr, mealKey: "lunch" })).status).toBe(409);
    const meals = (await sam.call("GET", "/api/staff-meals/today")).body as { meals: { key: string; servedAt: string | null }[] };
    expect(meals.meals.find((m) => m.key === "lunch")?.servedAt).toBeTruthy();

    // A notice with likes on and comments off.
    const post = (await hr("POST", "/api/notices", { title: "Staff party on Friday", body: "Garden, 7 PM", allowComments: false })).body as { id: string };
    const list = (await sam.call("GET", "/api/notices")).body as { items: { id: string; readByMe: boolean }[]; can: { post: boolean } };
    expect(list.items.map((n) => n.id)).toEqual([post.id]);
    expect(list.can.post).toBe(false);
    expect((await sam.call("POST", `/api/notices/${post.id}/like`)).body).toEqual({ liked: true, likes: 1 });
    expect((await sam.call("POST", `/api/notices/${post.id}/comments`, { body: "Yes!" })).body).toMatchObject({ error: "method_disabled" });
    expect((await sam.call("POST", "/api/notices", { title: "Hi", body: "x" })).status).toBe(403);
    await sam.call("GET", `/api/notices/${post.id}`);
    expect(((await hr("GET", `/api/notices/${post.id}/reads`)).body["items"] as unknown[]).length).toBe(1);
    // A post for one role only is hidden from everyone else.
    await hr("POST", "/api/notices", { title: "Gate rota", body: "New rota", audienceRoles: ["gatekeeper"] });
    expect(((await sam.call("GET", "/api/notices")).body["items"] as unknown[]).length).toBe(1);
    expect(((await gate.call("GET", "/api/notices")).body["items"] as unknown[]).length).toBe(2);

    // A lost card stops working at the gate.
    await hr("POST", `/api/cards/${card.cardId}/lost`);
    expect((await gate.call("POST", "/api/attendance/station-clock", { uid: "04A1B2C3D4E5F6", station: "Main gate" })).body).toMatchObject({ error: "permission_denied" });

    // Everything is in the Audit Trail, with the chain intact.
    const audit = (await owner("GET", "/api/audit/entries?limit=200")).body as { items: { action: string }[] };
    expect(audit.items.map((e) => e.action)).toEqual(
      expect.arrayContaining(["staff.enrolled", "card.registered", "card.issued", "attendance.clock_in", "attendance.corrected", "report.submitted", "report.signed", "meal.served", "notice.published", "card.lost"]),
    );
    expect((await owner("GET", "/api/audit/verify")).body).toMatchObject({ intact: true });
  });

  it("runs wristbands for an event by number range", async () => {
    const { person } = await hotel();
    const events = (await person("Eve", "events", ["role_events-manager"])).call;
    expect((await events("POST", "/api/wristbands/register-range", { from: 1, to: 300 })).body).toEqual({ added: 300, skipped: 0 });
    expect((await events("POST", "/api/wristbands/register-range", { from: 291, to: 310 })).body).toEqual({ added: 10, skipped: 10 });
    expect((await events("POST", "/api/wristbands/assign-range", { from: 1, to: 200, eventKey: "wedding-dec-5", eventName: "Wedding, 5 Dec" })).body).toEqual({ assigned: 200 });
    const band5 = ((await events("GET", "/api/wristbands/5")).body["band"] as { qr: string }).qr;
    // The door scans: right event, wrong event, unassigned, forged.
    const guard = await person("Gus", "security", ["role_security-guard"]);
    expect((await guard.call("POST", "/api/wristbands/scan", { qr: band5, eventKey: "wedding-dec-5" })).body).toMatchObject({ result: "ok" });
    expect((await guard.call("POST", "/api/wristbands/scan", { qr: band5, eventKey: "conference" })).body).toMatchObject({ result: "wrong_event" });
    expect((await guard.call("POST", "/api/wristbands/scan", { bandNumber: 250 })).body).toMatchObject({ result: "not_assigned" });
    expect((await guard.call("POST", "/api/wristbands/scan", { qr: band5.replace(/.$/, "0") === band5 ? band5.replace(/.$/, "1") : band5.replace(/.$/, "0") })).body).toMatchObject({ result: "unknown" });
    expect((await guard.call("POST", "/api/wristbands/assign-range", { from: 1, to: 5, eventKey: "x-y", eventName: "No" })).status).toBe(403);
    // Band 7 never came back; the rest go back into stock.
    await events("PATCH", "/api/wristbands/7", { status: "missing" });
    expect((await events("GET", "/api/wristbands/summary")).body).toMatchObject({ byStatus: { assigned: 199, missing: 1, in_stock: 110 } });
    expect((await events("POST", "/api/wristbands/reset-range", { from: 1, to: 200 })).body).toEqual({ reset: 200 });
    expect(((await events("GET", "/api/wristbands/scans")).body["items"] as unknown[]).length).toBe(4);
  });

  it("turns one module off without touching the others", async () => {
    const { owner, hr } = await hotel();
    expect((await owner("PATCH", "/api/admin/modules/attendance", { enabled: false })).status).toBe(200);
    expect((await hr("GET", "/api/attendance/board")).body).toMatchObject({ error: "module_disabled" });
    expect((await hr("GET", "/api/notices")).status).toBe(200);
    expect((await hr("GET", "/api/hr/staff")).status).toBe(200);
  });
});
