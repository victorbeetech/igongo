"use client";
// S00-36 Active sessions: every device I am signed in on, with "sign out"
// for any one of them. Live from the API.

import { useMySessions, useRevokeMySession } from "@/modules/m04-users-login/data/accountsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";

/** My signed-in devices. */
export function ActiveSessionsPage({ screen }: { screen: ScreenContext }) {
  const sessions = useMySessions();
  const revoke = useRevokeMySession();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={sessions} name={screen.spec.name}>
        {(d) => (
          <ul className="grid gap-2 p-4">
            {d.items.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface p-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-subtitle font-bold">{s.userAgent ?? "Unknown device"}</span>
                  <span className="block text-caption text-muted">Since {new Date(s.createdAt).toLocaleString()}{s.ipAddress ? ` · ${s.ipAddress}` : ""}</span>
                </span>
                {s.current ? <span className="text-caption font-bold text-success">This device</span> : <Button variant="secondary" onClick={() => revoke.mutate(s.id)}>Sign out</Button>}
              </li>
            ))}
          </ul>
        )}
      </LiveData>
    </>
  );
}
