"use client";
// S04-09 Login activity: the sign-in log for the super admin. Every sign-in,
// failed try, lockout, new device and sign-in method change, newest first,
// in hotel time (Africa/Kampala). Read from the Audit Trail, which cannot be
// changed afterwards.

import { useState } from "react";
import { useSignInLog } from "@/modules/m04-users-login/data/securityApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";

/** The filters: one Audit Trail action each, or all. */
const FILTERS: [string, string][] = [
  ["", "Everything"],
  ["login.succeeded", "Sign-ins"],
  ["login.failed", "Failed tries"],
  ["login.locked_out", "Lockouts"],
  ["login.new_device", "New devices"],
  ["account.matched_to_staff", "Staff matches"],
];

/** The sign-in log. */
export function LoginActivityPage({ screen }: { screen: ScreenContext }) {
  const [action, setAction] = useState("");
  const log = useSignInLog(action);
  return (
    <>
      <PurposeText text="Every sign-in, failed try and security change, newest first. Times are hotel time." />
      <div className="flex flex-wrap gap-2 px-4">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" aria-pressed={key === action} onClick={() => setAction(key)}
            className={`rounded-full border px-3 py-1 text-label ${key === action ? "border-primary bg-primary-container font-bold text-on-primary-container" : "border-line"}`}>
            {label}
          </button>
        ))}
      </div>
      <LiveData query={log} name={screen.spec.name} isEmpty={(d) => d.items.length === 0}>
        {(d) => (
          <ul className="m-4 rounded-md border border-line bg-surface">
            {d.items.map((e) => (
              <li key={e.id} className="grid gap-0.5 border-b border-line p-3 last:border-b-0">
                <span className="text-body">{e.summary}</span>
                <span className="text-caption text-muted">
                  {dayTimeOf(e.occurredAt)} · {e.actorName ?? e.recordId ?? "Someone"}{e.context?.ip ? ` · ${e.context.ip}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </LiveData>
    </>
  );
}
