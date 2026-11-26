/**
 * End-to-end test of saved and scheduled reports (module 81) on PGlite:
 * the super admin saves a report, runs it by hand, reads and downloads the
 * run; the 7 AM job runs a daily report once a day and a weekly one only
 * on Mondays; a pool attendant cannot see reports at all.
 */

import { describe, expect, it } from "vitest";
import { runScheduledReports } from "../src/shell/run-scheduled-reports";
import { testApi, testEnv } from "./helpers";

describe("saved reports", () => {
  it("saves, runs by hand and on schedule, and keeps every run", async () => {
    // A hotel with a super admin and one pool attendant.
    const t = await testApi();
    // The owner: set-up claimed and 2-step on, as the console requires.
    const owner = await t.owner();
    const created = (await owner("POST", "/api/users", { name: "Leo", email: "leo@example.com", password: "Leo pass 1234" })).body as { id: string };
    expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId: "role_pool-attendant" })).status).toBe(204);
    const leo = t.browser();
    expect((await leo("POST", "/api/auth/sign-in/email", { email: "leo@example.com", password: "Leo pass 1234" })).status).toBe(200);

    // The owner saves a daily food report and a weekly report on everything.
    const daily = (await owner("POST", "/api/reports/saved", { name: "Food yesterday", modules: ["food-ordering"], days: 1, schedule: "daily" })).body as { id: string; lastRunAt: string | null };
    expect(daily.lastRunAt).toBeNull();
    expect((await owner("POST", "/api/reports/saved", { name: "Week", modules: [], days: 7, schedule: "weekly" })).status).toBe(201);
    expect((await owner("POST", "/api/reports/saved", { name: "", modules: [], days: 3, schedule: "hourly" })).status).toBe(400);
    expect(((await owner("GET", "/api/reports/saved")).body as { reports: unknown[] }).reports).toHaveLength(2);

    // Run by hand: only the food area, today included, and kept.
    const run = (await owner("POST", `/api/reports/saved/${daily.id}/run`)).body as { id: string; groups: { module: string }[]; trigger: string };
    expect(run.groups.map((g) => g.module)).toEqual(["food-ordering"]);
    expect(run.trigger).toBe("manual");
    expect(((await owner("GET", `/api/reports/runs/${run.id}`)).body as { reportName: string }).reportName).toBe("Food yesterday");
    expect(((await owner("GET", `/api/reports/runs/${run.id}/export.csv`)).body as { text: string }).text).toContain("Food yesterday");

    // A pool attendant has no reports.
    expect((await leo("GET", "/api/reports/saved")).status).toBe(403);
    expect((await leo("GET", `/api/reports/runs/${run.id}`)).status).toBe(403);

    // 7 AM on Tuesday 1 Dec: the daily report runs; the weekly waits for Monday.
    const tuesday = await runScheduledReports(t.db, testEnv, new Date("2026-12-01T04:00:00Z"));
    expect(tuesday).toEqual({ ran: 1, failed: 0 });
    // The same morning again: nothing twice.
    expect(await runScheduledReports(t.db, testEnv, new Date("2026-12-01T04:05:00Z"))).toEqual({ ran: 0, failed: 0 });
    // Monday 7 Dec: both.
    expect(await runScheduledReports(t.db, testEnv, new Date("2026-12-07T04:00:00Z"))).toEqual({ ran: 2, failed: 0 });

    // The scheduled run covers yesterday.
    const runs = ((await owner("GET", `/api/reports/saved/${daily.id}/runs`)).body as { runs: { trigger: string; fromDay: string; toDay: string }[] }).runs;
    expect(runs[0]).toMatchObject({ trigger: "schedule", fromDay: "2026-12-06", toDay: "2026-12-06" });
    expect(runs).toHaveLength(3);

    // Removing the report keeps its runs for those who see everything.
    expect((await owner("DELETE", `/api/reports/saved/${daily.id}`)).status).toBe(204);
    expect((await owner("GET", `/api/reports/runs/${run.id}`)).status).toBe(200);

    // Switched off, the 7 AM job does nothing.
    expect((await owner("PATCH", "/api/admin/modules/reports-analytics", { enabled: false })).status).toBe(200);
    expect(await runScheduledReports(t.db, testEnv, new Date("2026-12-08T04:00:00Z"))).toBe("off");
  });
});
