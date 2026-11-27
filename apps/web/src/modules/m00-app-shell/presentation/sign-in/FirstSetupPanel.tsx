"use client";
// The one-time first super admin set-up, shown on the sign-in page until a
// super admin exists. The owner (the email saved as a Worker secret) signs
// in with Google, so the email is verified, and presses "Finish set-up".
// Then the portal asks for a password and 2-step before the console opens.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { claimSetup } from "@/modules/m04-users-login/data/authApi";
import { useApiMutation } from "@/shared/api/useApiMutation";
import { api } from "@/shared/api/apiClient";
import { useAddress } from "@/shared/navigation/useAddress";
import { ME_KEY } from "@/shared/session/useMe";
import { Button } from "@/shared/ui/button/Button";

/** The set-up panel. */
export function FirstSetupPanel() {
  const address = useAddress();
  const client = useQueryClient();
  // Who is signed in, if anyone (null when nobody).
  const session = useQuery({ queryKey: ["session"], queryFn: () => api<{ user?: { email: string } } | null>("/api/auth/get-session") });
  const claim = useApiMutation(claimSetup, { done: "You are the super admin. Now secure the account.", refresh: [ME_KEY, ["setup-status"]] });
  const email = session.data?.user?.email;
  return (
    <section className="grid gap-2 rounded-md border border-line bg-surface-alt p-3">
      <h2 className="flex items-center gap-2 text-label font-bold"><ShieldCheck size={16} aria-hidden className="text-primary-text" />First set-up</h2>
      <p className="text-caption text-muted">No super admin yet. Only the system owner can finish this, once.</p>
      {email ? (
        <Button block onClick={() => claim.mutate(undefined, { onSuccess: () => void client.invalidateQueries().then(() => address.push("/link-sign-in-methods")) })} disabled={claim.isPending}>
          Finish set-up as {email}
        </Button>
      ) : (
        // Google and Apple are app only. The owner signs in here with email and password first.
        <p className="text-caption text-muted">Sign in with your email and password first, then finish the set-up here.</p>
      )}
    </section>
  );
}
