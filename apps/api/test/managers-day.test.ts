/**
 * End-to-end test of the manager and money modules (build step 4) on PGlite:
 * a cook reports a leaking tap with a photo, maintenance fixes it while
 * colleagues like and comment; the kitchen supervisor does the daily
 * checkup and a failed line becomes a fault; the cook asks for an advance
 * and gets a cash bonus and buffet passes; payroll pays the month (taking
 * the instalment and adding the bonus); the cook reads their lifetime
 * statement; the GM reads the dashboard; staff and a guest chat; and the
 * owner finds who did what in the records. Checks scopes, switches and the
 * Audit Trail on the way.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** A tiny PNG, as base64 (a real image header, one pixel). */
const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

/** The pay month after this one, `YYYY-MM`, in hotel time (when advances start being taken). */
function nextPayMonth(): string {
  const [y, m] = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kampala" }).format(new Date()).split("-").map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

/** A hotel with a super admin, HR, and a way to add enrolled staff with pre-made roles. */
async function hotel() {
  const t = await testApi();
  // The owner: set-up claimed and 2-step on, as the console requires.
  const owner = await t.owner();

  /** A signed-in account holding [roleIds]. */
  async function account(name: string, roleIds: string[]) {
    const email = `${name.toLowerCase()}@example.com`;
    const created = (await owner("POST", "/api/users", { name, email, password: `${name} pass 1234` })).body as { id: string };
    for (const roleId of roleIds) expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId })).status).toBe(204);
    const call = t.browser();
    expect((await call("POST", "/api/auth/sign-in/email", { email, password: `${name} pass 1234` })).status).toBe(200);
    return { call, userId: created.id };
  }
  const hr = await account("Hana", ["role_hr-manager"]);

  /** Like [account], and enrolled by HR in [department]. */
  async function person(name: string, department: string, roleIds: string[] = []) {
    const { call, userId } = await account(name, roleIds);
    const staff = (await hr.call("POST", "/api/hr/staff", { name, department, jobTitle: "Staff", userId })).body as { staffId: string };
    return { call, userId, staffId: staff.staffId };
  }
  // Guests sign up in the app, never on the staff web portal.
  const guest = t.phone();
  expect((await guest("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
  return { ...t, owner, hr: hr.call, person, guest };
}

describe("managers and money", () => {
  it("reports and fixes a fault with a photo, likes and comments, and runs the daily checkup", async () => {
    const { owner, person, guest } = await hotel();
    const sam = await person("Sam", "kitchen");
    const max = await person("Max", "maintenance", ["role_maintenance-technician"]);
    const mia = await person("Mia", "maintenance", ["role_maintenance-manager"]);
    const sue = await person("Sue", "kitchen", ["role_department-supervisor"]);

    // The super admin sends plumbing faults to maintenance.
    expect((await owner("PUT", "/api/faults/settings", { categories: [{ key: "plumbing", name: "Plumbing", department: "maintenance" }], likesEnabled: true, commentsEnabled: true, photoRequired: true })).status).toBe(200);

    // Sam photographs the leak; the photo is private to people who may see faults.
    const photo = (await sam.call("POST", "/api/files", { name: "tap.png", type: "image/png", data: PNG, purpose: "faults-maintenance" })).body as { id: string };
    expect(photo.id).toMatch(/^fil_/);
    expect((await sam.call("POST", "/api/files", { name: "x.exe", type: "application/x-msdownload", data: PNG, purpose: "faults-maintenance" })).status).toBe(400);
    expect((await guest("POST", "/api/files", { name: "tap.png", type: "image/png", data: PNG, purpose: "faults-maintenance" })).status).toBe(403);
    expect((await guest("GET", `/api/files/${photo.id}`)).status).toBe(404);
    const img = await max.call("GET", `/api/files/${photo.id}`);
    expect(img.status).toBe(200);
    expect(img.headers.get("content-type")).toBe("image/png");
    // Safe uploads: served never-sniffed and sandboxed; a script dressed as a photo is refused.
    expect(img.headers.get("x-content-type-options")).toBe("nosniff");
    expect(img.headers.get("content-security-policy")).toContain("sandbox");
    const script = btoa("<?php system($_GET['c']); ?>");
    expect((await sam.call("POST", "/api/files", { name: "photo.jpg.php", type: "image/jpeg", data: script, purpose: "faults-maintenance" })).status).toBe(400);

    // A photo is required; with one, the fault goes to maintenance.
    expect((await sam.call("POST", "/api/faults", { title: "Kitchen tap leaking", category: "plumbing", location: "Main kitchen" })).status).toBe(400);
    const fault = (await sam.call("POST", "/api/faults", { title: "Kitchen tap leaking", category: "plumbing", location: "Main kitchen", priority: "high", photoIds: [photo.id] })).body as { id: string; number: string; department: string; status: string };
    expect(fault).toMatchObject({ number: "FLT-0001", department: "maintenance", status: "open" });

    // Maintenance sees it, likes and comments; a guest never does.
    expect(((await max.call("GET", "/api/faults?open=1")).body["items"] as unknown[]).length).toBe(1);
    expect((await max.call("POST", `/api/faults/${fault.id}/like`)).body).toMatchObject({ liked: true, likes: 1 });
    expect((await max.call("POST", `/api/faults/${fault.id}/comments`, { body: "On my way with a washer." })).status).toBe(201);
    expect((await guest("GET", `/api/faults/${fault.id}`)).status).toBe(403);
    // The list counts them too.
    expect(((await max.call("GET", "/api/faults?open=1")).body["items"] as unknown[])[0]).toMatchObject({ likes: 1, comments: 1, likedByMe: true });

    // The manager assigns Max; Max fixes it (saying what he did); Sam closes it.
    expect((await sam.call("POST", `/api/faults/${fault.id}/assign`, { staffId: sam.staffId })).status).toBe(403);
    expect((await mia.call("POST", `/api/faults/${fault.id}/assign`, { staffId: max.staffId })).body).toMatchObject({ status: "assigned" });
    expect((await max.call("POST", `/api/faults/${fault.id}/status`, { status: "in_progress" })).body).toMatchObject({ status: "in_progress" });
    expect((await max.call("POST", `/api/faults/${fault.id}/status`, { status: "fixed" })).status).toBe(400);
    expect((await max.call("POST", `/api/faults/${fault.id}/status`, { status: "fixed", note: "Changed the washer." })).body).toMatchObject({ status: "fixed", fixNote: "Changed the washer." });
    expect((await sam.call("POST", `/api/faults/${fault.id}/status`, { status: "closed" })).body).toMatchObject({ status: "closed" });
    const detail = (await sam.call("GET", `/api/faults/${fault.id}`)).body as { events: { to: string }[]; comments: unknown[]; likes: number };
    expect(detail.events.map((e) => e.to)).toEqual(["open", "assigned", "in_progress", "fixed", "closed"]);
    expect(detail).toMatchObject({ likes: 1 });
    // The super admin switches likes off: likes are refused.
    await owner("PUT", "/api/faults/settings", { categories: [], likesEnabled: false, commentsEnabled: true, photoRequired: false });
    expect((await max.call("POST", `/api/faults/${fault.id}/like`)).status).toBe(403);

    // The super admin builds the kitchen's opening check; Sue does it today.
    const list = (await owner("POST", "/api/inspections/checklists", {
      name: "Kitchen opening check",
      department: "kitchen",
      items: [{ key: "fridge", label: "Fridge below 5 C" }, { key: "exits", label: "Fire exits clear", photoOnFail: true }],
    })).body as { id: string };
    const today = (await sue.call("GET", "/api/inspections/today")).body["items"] as { checklist: { id: string }; done: unknown }[];
    expect(today).toHaveLength(1);
    expect(today[0]?.done).toBeNull();
    // A failed line that needs a photo is refused without one.
    const answers = [{ key: "fridge", result: "ok" }, { key: "exits", result: "fault", note: "Boxes in the way" }];
    expect((await sue.call("POST", "/api/inspections/runs", { checklistId: list.id, answers })).status).toBe(400);
    const exitPhoto = (await sue.call("POST", "/api/files", { name: "exit.png", type: "image/png", data: PNG, purpose: "inspections" })).body as { id: string };
    const run = (await sue.call("POST", "/api/inspections/runs", { checklistId: list.id, answers: [answers[0], { ...answers[1], photoIds: [exitPhoto.id] }] })).body as { id: string; score: number; faults: number; results: { faultNumber: string | null }[] };
    expect(run).toMatchObject({ score: 50, faults: 1 });
    expect(run.results[1]?.faultNumber).toBe("FLT-0002");
    expect(((await sue.call("GET", "/api/inspections/today")).body["items"] as { done: unknown }[])[0]?.done).not.toBeNull();
    // Sam (no checkup permission) cannot do it; Mia (all) sees the run, likes and comments.
    expect((await sam.call("POST", "/api/inspections/runs", { checklistId: list.id, answers })).status).toBe(403);
    expect((await mia.call("POST", `/api/inspections/runs/${run.id}/like`)).body).toMatchObject({ liked: true });
    expect((await mia.call("POST", `/api/inspections/runs/${run.id}/comments`, { body: "Moved the boxes." })).status).toBe(201);

    // With Faults switched off, checkups still work and simply raise nothing.
    expect((await owner("PATCH", "/api/admin/modules/faults-maintenance", { enabled: false })).status).toBe(200);
    expect((await sam.call("GET", "/api/faults")).status).toBe(503);
    const quiet = (await sue.call("POST", "/api/inspections/runs", { checklistId: list.id, answers: [answers[0], { ...answers[1], photoIds: [exitPhoto.id] }] })).body as { results: { faultNumber: string | null }[] };
    expect(quiet.results[1]?.faultNumber).toBeNull();
  });

  it("pays a month with an advance, a cash bonus and buffet passes, and shows the lifetime statement", async () => {
    const { owner, hr, person } = await hotel();
    const sam = await person("Sam", "kitchen");
    const pat = await person("Pat", "finance", ["role_payroll-officer"]);
    const fin = await person("Fay", "finance", ["role_finance-manager"]);
    const bea = await person("Bea", "kitchen", ["role_buffet-attendant"]);

    // Advance: the super admin allows up to 500,000 in up to 3 months.
    await owner("PUT", "/api/advances/settings", { advance: { enabled: true, maxAmount: 500000, maxInstalments: 3 }, loan: { enabled: false, maxAmount: 0, maxInstalments: 12 }, oneOpenAtATime: true });
    expect((await sam.call("POST", "/api/advances/mine", { amount: 900000, instalments: 1, reason: "School fees" })).status).toBe(400);
    const adv = (await sam.call("POST", "/api/advances/mine", { amount: 300000, instalments: 3, reason: "School fees" })).body as { id: string; number: string; instalmentAmount: number };
    expect(adv).toMatchObject({ number: "ADV-0001", instalmentAmount: 100000 });
    expect((await sam.call("POST", "/api/advances/mine", { amount: 1000, instalments: 1, reason: "Again" })).status).toBe(400);
    expect((await sam.call("GET", "/api/advances")).status).toBe(403);
    expect((await sam.call("POST", `/api/advances/${adv.id}/decide`, { approve: true })).status).toBe(403);
    expect((await fin.call("POST", `/api/advances/${adv.id}/decide`, { approve: true, note: "OK" })).body).toMatchObject({ status: "approved" });
    expect((await pat.call("POST", `/api/advances/${adv.id}/disburse`)).body).toMatchObject({ status: "disbursed" });

    // Bonuses: a cash bonus waits for approval; buffet passes are served at the buffet.
    const cash = (await hr("POST", "/api/bonuses", { staffId: sam.staffId, kind: "cash", amount: 50000, reason: "Employee of the month" })).body as { id: string; status: string };
    expect(cash.status).toBe("pending");
    expect((await fin.call("POST", `/api/bonuses/${cash.id}/decide`, { approve: true })).status).toBe(403);
    const gm = await person("Gus", "management", ["role_general-manager"]);
    expect((await gm.call("POST", `/api/bonuses/${cash.id}/decide`, { approve: true })).body).toMatchObject({ status: "approved" });
    const meal = (await hr("POST", "/api/bonuses", { staffId: sam.staffId, kind: "buffet", passes: 2, reason: "Team spirit" })).body as { id: string };
    await gm.call("POST", `/api/bonuses/${meal.id}/decide`, { approve: true });
    expect((await sam.call("GET", "/api/bonuses/mine")).body).toMatchObject({ passesLeft: 2 });
    expect((await sam.call("POST", "/api/bonuses/buffet/redeem", { staffId: sam.staffId })).status).toBe(403);
    expect((await bea.call("POST", "/api/bonuses/buffet/redeem", { staffId: sam.staffId })).body).toMatchObject({ ok: true, staffName: "Sam", passesLeft: 1 });
    expect((await bea.call("POST", "/api/bonuses/buffet/redeem", { staffId: sam.staffId })).body).toMatchObject({ ok: false, reason: "used_today" });

    // Payroll: a profile, a deduction rule from the super admin, then next month's run.
    expect((await pat.call("PUT", `/api/payroll/profiles/${sam.staffId}`, { basic: 600000, allowances: [{ name: "Transport", amount: 50000 }], payMethod: "mobile_money", account: "0772000000" })).status).toBe(200);
    await owner("PUT", "/api/payroll/settings", { deductions: [{ key: "fund", name: "Staff fund", kind: "percent", rate: 5, base: "basic", employerRate: 10 }], approverMustDiffer: true });
    const period = nextPayMonth();
    const run = (await pat.call("POST", "/api/payroll/runs", { period })).body as { id: string; staffCount: number; net: number };
    expect(run.staffCount).toBe(1);
    expect((await pat.call("POST", "/api/payroll/runs", { period })).status).toBe(409);
    const slips = ((await pat.call("GET", `/api/payroll/runs/${run.id}`)).body["payslips"] as { id: string; gross: number; net: number; deductions: { name: string; amount: number }[] }[]);
    // 600,000 + 50,000 transport + 50,000 bonus; minus 30,000 fund and 100,000 advance.
    expect(slips[0]).toMatchObject({ gross: 700000, net: 570000 });
    expect(slips[0]?.deductions.map((d) => d.name)).toEqual(["Staff fund", "Advance ADV-0001"]);
    // Overtime added by hand; the maker cannot approve their own run; finance does.
    expect((await pat.call("PUT", `/api/payroll/payslips/${slips[0]?.id}/adjustments`, { adjustments: [{ name: "Overtime", amount: 20000 }] })).body).toMatchObject({ net: 590000 });
    expect((await pat.call("POST", `/api/payroll/runs/${run.id}/approve`)).status).toBe(403);
    expect((await fin.call("POST", `/api/payroll/runs/${run.id}/approve`)).body).toMatchObject({ status: "approved", net: 590000 });
    expect((await pat.call("POST", `/api/payroll/runs/${run.id}/paid`)).body).toMatchObject({ status: "paid" });
    // Paying settled the advance instalment and the bonus in their own modules.
    expect(((await sam.call("GET", `/api/advances/${adv.id}`)).body["advance"] as { repaid: number }).repaid).toBe(100000);
    expect(((await sam.call("GET", "/api/bonuses/mine")).body["items"] as { kind: string; status: string }[]).find((b) => b.kind === "cash")?.status).toBe("paid");
    const csv = await pat.call("GET", `/api/payroll/runs/${run.id}/export.csv`);
    expect(String(csv.body["text"])).toContain("Sam");

    // Sam reads their own lifetime statement and payslip; never the payroll tools.
    expect((await sam.call("GET", "/api/payroll/runs")).status).toBe(403);
    const me = (await sam.call("GET", "/api/earnings/mine")).body as { lifetime: Record<string, number>; payslips: { payslipId: string }[] };
    expect(me.lifetime).toMatchObject({ gross: 720000, net: 590000, cashBonuses: 50000, buffetPasses: 2, buffetPassesUsed: 1, advancesTaken: 300000, advancesRepaid: 100000, payslips: 1 });
    expect((await sam.call("GET", `/api/earnings/mine/payslips/${me.payslips[0]?.payslipId}`)).status).toBe(200);
    expect((await sam.call("GET", `/api/earnings/staff/${pat.staffId}`)).status).toBe(403);
    expect((await hr("GET", `/api/earnings/staff/${sam.staffId}`)).status).toBe(200);

    // The GM's dashboard has every module's numbers; Sam has none.
    const dash = (await gm.call("GET", "/api/reports/dashboard?from=2020-01-01")).body as { groups: { module: string; failed: boolean; kpis: { key: string; value: number }[] }[] };
    const kpi = (key: string) => dash.groups.flatMap((g) => g.kpis).find((k) => k.key === key)?.value;
    expect(dash.groups.every((g) => !g.failed)).toBe(true);
    expect(kpi("advances.owed")).toBe(200000);
    expect(kpi("payroll.net")).toBe(590000);
    expect(kpi("bonuses.buffet")).toBe(1);
    expect((await sam.call("GET", "/api/reports/dashboard")).status).toBe(403);
    // Finance's settlement report answers (no payments yet in this test).
    expect((await fin.call("GET", "/api/payments/settlement?from=2020-01-01&to=2030-01-01")).body).toMatchObject({ items: [], total: 0 });
  });

  it("lets staff and guests chat, and finds who did what in the records", async () => {
    const { owner, person, guest } = await hotel();
    const sam = await person("Sam", "kitchen");
    const max = await person("Max", "maintenance");
    const rita = await person("Rita", "front-office", ["role_receptionist"]);

    // Staff: Sam finds Max and writes; Max sees one unread.
    const people = (await sam.call("GET", "/api/chat/people?q=ma")).body["items"] as { userId: string }[];
    expect(people.map((p) => p.userId)).toContain(max.userId);
    const dm = (await sam.call("POST", "/api/chat/conversations", { kind: "direct", userId: max.userId })).body as { id: string };
    expect(((await sam.call("POST", "/api/chat/conversations", { kind: "direct", userId: max.userId })).body as { id: string }).id).toBe(dm.id);
    expect((await sam.call("POST", `/api/chat/conversations/${dm.id}/messages`, { body: "Is the oven fixed?" })).status).toBe(201);
    const maxList = (await max.call("GET", "/api/chat/conversations")).body["items"] as { id: string; unread: number }[];
    expect(maxList.find((c) => c.id === dm.id)?.unread).toBe(1);
    await max.call("POST", `/api/chat/conversations/${dm.id}/read`);
    expect(((await max.call("GET", "/api/chat/conversations")).body["items"] as { unread: number }[])[0]?.unread).toBe(0);
    expect((await rita.call("GET", `/api/chat/conversations/${dm.id}/messages`)).status).toBe(404);

    // A guest writes to the front desk; the receptionist answers; guests cannot reach staff chat.
    expect((await guest("GET", "/api/chat/people")).status).toBe(403);
    expect((await guest("POST", "/api/chat/conversations", { kind: "direct", userId: max.userId })).status).toBe(403);
    const desk = (await guest("POST", "/api/chat/desks/front-desk")).body as { id: string; kind: string };
    expect(desk.kind).toBe("desk");
    await guest("POST", `/api/chat/conversations/${desk.id}/messages`, { body: "Can I check in early?" });
    expect(((await rita.call("GET", "/api/chat/conversations")).body["items"] as { id: string; unread: number }[]).find((c) => c.id === desk.id)?.unread).toBe(1);
    expect((await sam.call("GET", `/api/chat/conversations/${desk.id}/messages`)).status).toBe(404);
    await rita.call("POST", `/api/chat/conversations/${desk.id}/messages`, { body: "Yes, from 10 AM." });
    const thread = (await guest("GET", `/api/chat/conversations/${desk.id}/messages`)).body as { items: { senderName: string }[]; members: { name: string }[] };
    expect(thread.items.map((m) => m.senderName)).toEqual(["Grace", "Rita"]);
    expect(thread.members.map((m) => m.name)).toContain("Rita");

    // Records: who enrolled Sam? The owner finds it, sees the record's history and exports.
    const found = (await owner("GET", "/api/records/search?q=Sam")).body as { items: { module: string; summary: string }[] };
    expect(found.items.some((e) => e.module === "hr-records")).toBe(true);
    expect((await sam.call("GET", "/api/records/search?q=Sam")).status).toBe(403);
    const history = (await owner("GET", `/api/records/history/staff/${sam.staffId}`)).body["items"] as unknown[];
    expect(history.length).toBeGreaterThan(0);
    const csv = await owner("GET", "/api/records/export.csv?q=Sam");
    expect(String(csv.body["text"])).toContain("When,Who,Module");
    expect(((await owner("GET", "/api/records/search?q=Exported")).body["items"] as unknown[]).length).toBe(1);
  });
});
