"use client";
// S04-02 Account detail: one account's status, sign-in methods, roles and
// signed-in devices, with approve, lock, unlock and sign-out-everywhere.
// Roles are given on the Role holders page (Roles & Permissions).

import { useQuery } from "@tanstack/react-query";
import { useAccount, useAccountSessions, useSetStatus, useSignOutAccount, type Account } from "@/modules/m04-users-login/data/accountsApi";
import { api } from "@/shared/api/apiClient";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The account detail page; the account ID is the last part of the address. */
export function AccountDetailPage({ screen }: { screen: ScreenContext }) {
  const id = recordIdOf(useAddress().path);
  const account = useAccount(id);
  return (
    <LiveData query={account} name={screen.spec.name}>
      {(a) => <AccountBody account={a} />}
    </LiveData>
  );
}

/** The loaded account. */
function AccountBody({ account: a }: { account: Account }) {
  const sessions = useAccountSessions(a.id);
  const roles = useQuery({ queryKey: ["user-roles", a.id], queryFn: () => api<{ items: { roleId: string; endsAt: string | null }[] }>(`/api/access/users/${a.id}/roles`) });
  const setStatus = useSetStatus(a.id);
  const signOut = useSignOutAccount(a.id);
  return (
    <div className="grid gap-4 p-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-title font-bold">{a.name}</h2>
          <StatusChip status={a.status[0]!.toUpperCase() + a.status.slice(1)} />
        </div>
        <p className="text-body text-muted">{a.email}{a.phoneNumber ? ` · ${a.phoneNumber}` : ""} · {a.kind} account</p>
        <p className="text-caption text-muted">Signs in with: {a.providers.join(", ") || "no method yet"} · 2FA {a.twoFactorEnabled ? "on" : "off"}</p>
        {/* The status actions that make sense from here. */}
        <div className="mt-3 flex flex-wrap gap-2">
          {a.status !== "active" && <Button onClick={() => setStatus.mutate("active")}>{a.status === "pending" ? "Approve" : "Unlock"}</Button>}
          {a.status === "active" && <Button variant="danger" onClick={() => setStatus.mutate("locked")}>Lock account</Button>}
          {a.status === "active" && <Button variant="secondary" onClick={() => setStatus.mutate("suspended")}>Suspend</Button>}
          <Button variant="secondary" onClick={() => signOut.mutate(undefined)}>Sign out everywhere</Button>
        </div>
      </Card>
      <SectionHeader title="Roles" />
      <LiveData query={roles} name="Roles" isEmpty={(d) => d.items.length === 0}>
        {(d) => <ul className="grid gap-1 text-body">{d.items.map((r) => <li key={r.roleId}>{r.roleId.replace(/^role_/, "")}{r.endsAt ? ` (until ${new Date(r.endsAt).toLocaleDateString()})` : ""}</li>)}</ul>}
      </LiveData>
      <SectionHeader title="Signed-in devices" />
      <LiveData query={sessions} name="Signed-in devices" isEmpty={(d) => d.items.length === 0}>
        {(d) => (
          <ul className="grid gap-1 text-body">
            {d.items.map((s) => <li key={s.id}>{s.userAgent ?? "Unknown device"} · since {new Date(s.createdAt).toLocaleString()}</li>)}
          </ul>
        )}
      </LiveData>
    </div>
  );
}
