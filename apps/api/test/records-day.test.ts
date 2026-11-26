/**
 * End-to-end test of the records-kit modules (build step 5) on PGlite:
 * lost & found from both sides (a guest reports, staff log and hand over),
 * leave requested by a cook and approved by their supervisor, a task done
 * by the staff member it was given to, the super admin adding a field
 * without code, the QR lookup, the export, and a switched-off module that
 * leaves the others working. Checks scopes and the Audit Trail on the way.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

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
    const { call, userId } = await account(name, ["role_staff-base", ...roleIds]);
    const staff = (await hr.call("POST", "/api/hr/staff", { name, department, jobTitle: "Staff", userId })).body as { staffId: string };
    return { call, userId, staffId: staff.staffId };
  }
  // Guests sign up in the app, never on the staff web portal.
  const guest = t.phone();
  expect((await guest("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
  return { ...t, owner, person, guest };
}

describe("records-kit modules", () => {
  it("runs lost & found, leave and tasks on real data, with scopes", async () => {
    const { owner, person, guest } = await hotel();
    const fo = await person("Faith", "front-office", ["role_front-office-manager"]);
    const sam = await person("Sam", "kitchen");
    const sue = await person("Sue", "kitchen", ["role_department-supervisor"]);

    // A guest reports a lost phone; they see only their own reports and may not log found items.
    const lost = (await guest("POST", "/api/lost-found/records", { type: "lost", fields: { item: "Phone", lost_at: "Pool", phone: "+256700000000" } })).body as { id: string; code: string; status: string; qr: string };
    expect(lost).toMatchObject({ code: "LF-0001", status: "reported", qr: "IGG-REC:LF-0001" });
    expect((await guest("POST", "/api/lost-found/records", { type: "found", fields: { item: "Wallet", found_at: "Pool" } })).status).toBe(403);
    expect((await guest("POST", "/api/lost-found/records", { type: "lost", fields: { item: "Hat" } })).status).toBe(400);

    // Front office logs the phone found, matches and hands it over; the guest follows along.
    const found = (await fo.call("POST", "/api/lost-found/records", { type: "found", fields: { item: "Phone", found_at: "Pool deck", shelf: "Safe 2" } })).body as { id: string; code: string };
    expect(found.code).toBe("LF-0002");
    expect((await fo.call("POST", `/api/lost-found/records/${lost.id}/status`, { status: "matched", note: `Found as ${found.code}` })).status).toBe(200);
    expect((await fo.call("POST", `/api/lost-found/records/${found.id}/status`, { status: "handed_over" })).body).toMatchObject({ status: "handed_over" });
    expect((await guest("POST", `/api/lost-found/records/${lost.id}/comments`, { text: "Thank you!" })).status).toBe(201);
    const mine = (await guest("GET", "/api/lost-found/records")).body as { items: { id: string }[] };
    expect(mine.items.map((r) => r.id)).toEqual([lost.id]);
    expect((await guest("GET", `/api/lost-found/records/${found.id}`)).status).toBe(404);
    const detail = (await guest("GET", `/api/lost-found/records/${lost.id}`)).body as { events: { kind: string; text: string }[] };
    expect(detail.events.map((e) => e.kind)).toEqual(["created", "status", "comment"]);
    expect(detail.events[1]?.text).toBe("Reported to Matched: Found as LF-0002");
    // Staff find a record by its QR; guests cannot move it.
    expect((await fo.call("GET", "/api/lost-found/lookup/IGG-REC:LF-0002")).body).toMatchObject({ id: found.id });
    expect((await guest("POST", `/api/lost-found/records/${lost.id}/status`, { status: "returned" })).status).toBe(403);

    // Sam asks for sick leave; he cannot approve it, his supervisor can.
    const leave = (await sam.call("POST", "/api/leave/records", { type: "leave", fields: { kind: "Sick", days: 2 }, dueOn: "2026-12-01" })).body as { id: string; status: string; title: string };
    expect(leave).toMatchObject({ status: "requested", title: "Sick" });
    expect((await sam.call("POST", `/api/leave/records/${leave.id}/status`, { status: "approved" })).status).toBe(403);
    expect((await sue.call("POST", `/api/leave/records/${leave.id}/status`, { status: "approved" })).body).toMatchObject({ status: "approved" });
    // After approval Sam can no longer change his request.
    expect((await sam.call("PATCH", `/api/leave/records/${leave.id}`, { fields: { days: 5 } })).status).toBe(409);

    // Sue gives Sam a task; Sam sees it in his list and marks it done.
    const task = (await sue.call("POST", "/api/tasks/records", { type: "task", fields: { what: "Deep clean the cold room", priority: "High" }, assigneeId: sam.staffId })).body as { id: string; assigneeName: string };
    expect(task.assigneeName).toBe("Sam");
    expect(((await sam.call("GET", "/api/tasks/records?open=1")).body as { items: unknown[] }).items).toHaveLength(1);
    expect((await sam.call("POST", `/api/tasks/records/${task.id}/status`, { status: "done" })).body).toMatchObject({ status: "done" });
    expect(((await sam.call("GET", "/api/tasks/records?open=1")).body as { items: unknown[] }).items).toHaveLength(0);

    // The super admin adds a "Colour" field to found items, with no code; ordinary staff may not change the set-up.
    const config = (await owner("GET", "/api/lost-found/config")).body as { types: { key: string; fields: unknown[] }[] };
    const types = config.types.map((t) => (t.key === "found" ? { ...t, fields: [...t.fields, { key: "colour", label: "Colour", kind: "select", options: ["Black", "Red"] }] } : t));
    expect((await owner("PUT", "/api/lost-found/config", { ...config, types })).status).toBe(200);
    expect((await sam.call("PUT", "/api/lost-found/config", { ...config, types })).status).toBe(403);
    expect((await fo.call("POST", "/api/lost-found/records", { type: "found", fields: { item: "Scarf", found_at: "Museum", colour: "Blue" } })).status).toBe(400);
    expect((await fo.call("POST", "/api/lost-found/records", { type: "found", fields: { item: "Scarf", found_at: "Museum", colour: "Red" } })).status).toBe(201);

    // The export has the new column; the Audit Trail has every change.
    const csv = (await owner("GET", "/api/lost-found/export?type=found")).body as { text: string };
    expect(csv.text.split("\r\n")[0]).toContain("Colour");
    const audit = (await owner("GET", "/api/audit/entries?module=lost-found")).body as { items: { action: string }[] };
    expect(audit.items.map((e) => e.action)).toEqual(expect.arrayContaining(["record.created", "record.status", "record.comment", "records.settings_changed"]));

    // Switching Lost & Found off leaves Tasks working.
    expect((await owner("PATCH", "/api/admin/modules/lost-found", { enabled: false })).status).toBe(200);
    expect((await fo.call("GET", "/api/lost-found/records")).status).toBe(503);
    expect((await sam.call("GET", "/api/tasks/records")).status).toBe(200);
  });
});
