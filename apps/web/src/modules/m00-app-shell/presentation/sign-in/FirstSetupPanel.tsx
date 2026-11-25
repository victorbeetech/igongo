"use client";
// The one-time first super admin set-up, shown on the sign-in page until a
// super admin exists. The owner signs in with Google (their email is then
// verified), and presses "Finish set-up". Nobody else can complete it.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { claimSetup, signInSocial } from "@/modules/m04-users-login/data/authApi";
import { useApiMutation } from "@/shared/api/useApiMutation";
import { api } from "@/shared/api/apiClient";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { useAddress } from "@/shared/navigation/useAddress";
import { ME_KEY } from "@/shared/session/useMe";
import { Button } from "@/shared/ui/button/Button";

/** The set-up panel. */
export function FirstSetupPanel() {
  const address = useAddress();
  const client = useQueryClient();
  // Who is signed in, if anyone (null when nobody).
  const session = useQuery({ queryKey: ["session"], queryFn: () => api<{ user?: { email: string } } | null>("/api/auth/get-session") });
  const claim = useApiMutation(claimSetup, { done: "You are the super admin", refresh: [ME_KEY, ["setup-status"]] });
  const email = session.data?.user?.email;
  return (
    <section className="grid gap-2 rounded-md border border-primary-text/40 bg-primary-container p-3 text-on-primary-container">
      <h2 className="flex items-center gap-2 text-subtitle font-bold"><ShieldCheck size={18} aria-hidden />First set-up</h2>
      <p className="text-caption">No super admin exists yet. The system owner signs in with Google, then finishes the set-up.</p>
      {email ? (
        <Button onClick={() => claim.mutate(undefined, { onSuccess: () => void client.invalidateQueries().then(() => address.push("/super-admin/console-home")) })} disabled={claim.isPending}>
          Finish set-up as {email}
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => void signInSocial("google", absoluteUrl("/sign-in"))}>Sign in with Google to start</Button>
      )}
    </section>
  );
}
