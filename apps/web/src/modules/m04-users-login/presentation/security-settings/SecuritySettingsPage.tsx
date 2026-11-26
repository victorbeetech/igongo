"use client";
// S04-08 Security settings: the super admin's sign-in and security rules,
// all enforced on the server and saved to the Audit Trail:
//   1. warnings (a second super admin, 2-step not on) and the super admins;
//   2. passwords and lockout;
//   3. sessions on the web portal (short sessions, idle sign-out);
//   4. 2-step for sensitive roles, and new-device alerts.
// The sign-in methods themselves are on Login methods (S04-06), the log on
// Login activity (S04-09).

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useSaveSecurityRules, useSecurityOverview } from "@/modules/m04-users-login/data/securityApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { NumberRule } from "./NumberRule";

/** The Security settings page. */
export function SecuritySettingsPage({ screen }: { screen: ScreenContext }) {
  const overview = useSecurityOverview();
  const save = useSaveSecurityRules();
  return (
    <>
      <PurposeText text="Every rule here is checked by the server for every sign-in and every request." />
      <LiveData query={overview} name={screen.spec.name}>
        {(d) => {
          const p = d.policy;
          const num = (key: string) => Number(p[key] ?? 0);
          return (
            <div className="grid gap-3 p-4">
              {/* Step 1: what needs doing, and who the super admins are. */}
              {d.warnings.map((w) => (
                <p key={w} role="alert" className="flex items-start gap-2 rounded-md border border-warning/50 bg-warning/10 p-3 text-caption">
                  <AlertTriangle size={16} aria-hidden className="mt-0.5 shrink-0" />
                  {w}
                </p>
              ))}
              <SectionHeader title="Super admins" />
              <ul className="rounded-md border border-line bg-surface">
                {d.superAdmins.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 border-b border-line p-3 last:border-b-0">
                    <span className="flex-1 text-body">{a.name} <span className="text-caption text-muted">{a.email}</span></span>
                    <span className={`inline-flex items-center gap-1 text-caption ${a.twoFactorEnabled ? "text-success" : "text-error"}`}>
                      <ShieldCheck size={14} aria-hidden />2-step {a.twoFactorEnabled ? "on" : "off"}
                    </span>
                  </li>
                ))}
              </ul>
              {/* Step 2: passwords and lockout. */}
              <SectionHeader title="Passwords and wrong tries" />
              <div className="rounded-md border border-line bg-surface">
                <NumberRule label="Shortest password" unit="characters" value={num("passwordMinLength")} min={8} max={64} onSave={(v) => save.mutate({ passwordMinLength: v })} />
                <SwitchRow label="Passwords need a letter and a number" on={p["passwordNeedsLetterAndNumber"] === true} onChange={(v) => save.mutate({ passwordNeedsLetterAndNumber: v })} />
                <NumberRule label="Wrong passwords before the email is locked" unit="tries" value={num("maxFailedAttempts")} min={3} max={20} onSave={(v) => save.mutate({ maxFailedAttempts: v })} />
                <NumberRule label="Locked for" unit="minutes" value={num("lockoutMinutes")} min={1} max={1440} onSave={(v) => save.mutate({ lockoutMinutes: v })} />
              </div>
              {/* Step 3: web sessions (shared gate and reception computers). */}
              <SectionHeader title="Web portal sessions" />
              <div className="rounded-md border border-line bg-surface">
                <NumberRule label="Staff sign-in lasts at most" unit="hours" value={num("staffWebSessionHours")} min={1} max={72} onSave={(v) => save.mutate({ staffWebSessionHours: v })} />
                <NumberRule label="Sign out after no activity for" unit="minutes" value={num("webIdleMinutes")} min={2} max={240} onSave={(v) => save.mutate({ webIdleMinutes: v })} />
              </div>
              {/* Step 4: 2-step for sensitive roles, and alerts. */}
              <SectionHeader title="2-step and alerts" />
              <div className="rounded-md border border-line bg-surface">
                <SwitchRow label="Super admins must use 2-step" hint="Always on. It cannot be switched off." on disabled onChange={() => undefined} />
                <SwitchRow
                  label="Staff in sensitive roles must use 2-step"
                  hint={`Payroll, finance, HR and the top team: ${((p["sensitiveRoleKeys"] as string[] | undefined) ?? []).length} roles. They will sign in with email, password and a code.`}
                  on={p["twoFactorForSensitiveRoles"] === true}
                  onChange={(v) => save.mutate({ twoFactorForSensitiveRoles: v })}
                />
                <SwitchRow label="Alert on sign-in from a new device" hint="The person is told, and for staff, every super admin." on={p["newDeviceAlerts"] === true} onChange={(v) => save.mutate({ newDeviceAlerts: v })} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" href="/users-login/login-methods">Sign-in methods</Button>
                <Button variant="secondary" href="/users-login/login-activity">Sign-in log</Button>
                <Button variant="secondary" href="/link-sign-in-methods">My 2-step and recovery codes</Button>
              </div>
            </div>
          );
        }}
      </LiveData>
    </>
  );
}
