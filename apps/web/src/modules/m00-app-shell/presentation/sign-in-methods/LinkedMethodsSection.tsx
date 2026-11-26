"use client";
// Part 3 of the sign-in security page: the sign-in methods linked to this
// one account. Google and Apple can be added (the provider must give the
// same email; Apple "Hide My Email" addresses are linked here by hand) and
// removed, with a sign-in from the last 10 minutes. The last method can
// never be removed. Every change is recorded and emailed to the person.

import { linkProvider, useUnlinkProvider } from "@/modules/m04-users-login/data/securityApi";
import { ApiError } from "@/shared/api/ApiError";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { AppleIcon } from "@/shared/ui/brand-icons/AppleIcon";
import { GoogleIcon } from "@/shared/ui/brand-icons/GoogleIcon";
import { Button } from "@/shared/ui/button/Button";
import { showToast } from "@/shared/ui/toast/toast";

/** Each method's name and mark. */
const METHODS = [
  { id: "credential", name: "Email and password", icon: null },
  { id: "google", name: "Google", icon: <GoogleIcon /> },
  { id: "apple", name: "Apple", icon: <AppleIcon /> },
] as const;

/** The linked methods list. */
export function LinkedMethodsSection({ providers }: { providers: string[] }) {
  const unlink = useUnlinkProvider();
  const link = (provider: "google" | "apple") =>
    void linkProvider(provider, absoluteUrl("/link-sign-in-methods")).catch((e: unknown) => showToast(e instanceof ApiError ? e.message : "We couldn't reach Igongo."));
  return (
    <section className="grid gap-2 rounded-md border border-line p-3">
      <h2 className="text-subtitle font-bold">Sign-in methods</h2>
      <ul className="grid gap-2">
        {METHODS.map((m) => {
          const linked = providers.includes(m.id);
          return (
            <li key={m.id} className="flex items-center gap-3">
              <span className="inline-flex size-6 items-center justify-center">{m.icon}</span>
              <span className="flex-1 text-body">{m.name}</span>
              {linked && providers.length > 1 && <Button variant="text" disabled={unlink.isPending} onClick={() => unlink.mutate(m.id)}>Remove</Button>}
              {linked && providers.length === 1 && <span className="text-caption text-muted">Your only method</span>}
              {!linked && m.id !== "credential" && <Button variant="secondary" onClick={() => link(m.id)}>Link</Button>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
