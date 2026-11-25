"use client";
// S04-06 Login methods: the super admin's switch for every sign-in method,
// and the login rules (self sign-up, approval). Saved at once, recorded in
// the Audit Trail. Limiting a method to some roles is set per method below.

import { useMethodSettings, useUpdateMethod, useUpdatePolicy } from "@/modules/m04-users-login/data/accountsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The login methods page. */
export function LoginMethodsPage({ screen }: { screen: ScreenContext }) {
  const settings = useMethodSettings();
  const update = useUpdateMethod();
  const policy = useUpdatePolicy();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>
        {(d) => (
          <div className="grid gap-2 p-4">
            <SectionHeader title="Sign-in methods" />
            <div className="rounded-md border border-line bg-surface">
              {d.methods.map((m) => (
                <SwitchRow
                  key={m.method}
                  label={m.label}
                  hint={`${m.platform === "app" ? "App only" : "App and web"}${m.allowedRoleKeys ? ` · only ${m.allowedRoleKeys.join(", ")}` : " · every role"}`}
                  on={m.enabled}
                  disabled={update.isPending}
                  onChange={(enabled) => update.mutate({ method: m.method, enabled })}
                />
              ))}
            </div>
            <SectionHeader title="Login rules" />
            <div className="rounded-md border border-line bg-surface">
              <SwitchRow label="Guests can create their own accounts" on={d.policy["allowSelfRegistration"] === true} onChange={(v) => policy.mutate({ allowSelfRegistration: v })} />
              <SwitchRow label="New guest accounts wait for approval" on={d.policy["newAccountsNeedApproval"] === true} onChange={(v) => policy.mutate({ newAccountsNeedApproval: v })} />
            </div>
          </div>
        )}
      </LiveData>
    </>
  );
}
