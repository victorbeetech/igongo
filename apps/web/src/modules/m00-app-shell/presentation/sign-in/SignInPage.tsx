"use client";
// S00-05 Sign in on the web portal. The portal is for hotel staff and the
// super admin only (guests use the app), so there is no guest sign-up here,
// and the server refuses guest accounts whatever this page does.
//
// Steps: email and password, then a 2-step code when the account has 2-step
// on. Google and Apple are not offered here: the portal signs in with email
// and password only.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  fetchLoginMethods,
  fetchSetupStatus,
  signInEmail,
} from "@/modules/m04-users-login/data/authApi";
import { ApiError } from "@/shared/api/ApiError";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { useAddress } from "@/shared/navigation/useAddress";
import { ME_KEY } from "@/shared/session/useMe";
import { MY_LAYOUT_KEY } from "@/shared/session/useMyLayout";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import { FirstSetupPanel } from "./FirstSetupPanel";
import { signInErrorText } from "./signInErrors";

/** The sign-in page. */
export function SignInPage({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  const address = useAddress();
  const client = useQueryClient();
  const methods = useQuery({
    queryKey: ["login-methods"],
    queryFn: fetchLoginMethods,
  });
  const setup = useQuery({
    queryKey: ["setup-status"],
    queryFn: fetchSetupStatus,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // An error brought back in the address (a sign-out reason), else none.
  const returned = address.params.get("error") ?? address.params.get("reason");
  const [error, setError] = useState<string | null>(
    returned ? signInErrorText(returned) : null,
  );
  const [busy, setBusy] = useState(false);

  /** Step 1: email and password, then home (or the 2-step code). */
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await signInEmail(email, password);
      await client.invalidateQueries({ queryKey: ME_KEY });
      await client.invalidateQueries({ queryKey: MY_LAYOUT_KEY });
      address.push(
        result.twoFactorRedirect ? hrefFor("S00-16", here) : "/home",
      );
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Sign-in failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (methods.isPending) return <SkeletonList />;
  return (
    <div className="grid gap-4 p-4 pt-2">
      <p className="text-caption text-muted">
        For hotel staff. Guests use the Igongo app.
      </p>
      {setup.data?.needed && <FirstSetupPanel />}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-error/40 bg-error/10 p-3 text-caption text-error"
        >
          {error}
        </p>
      )}
      <form onSubmit={submit} className="grid gap-3">
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="username"
          hint="name@example.com"
          required
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        {/* Step 1: "Remember me" on the left, "Forgot password?" on the right, as the board shows. */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-caption">
            <input type="checkbox" defaultChecked className="size-4 accent-primary" />
            Remember me
          </label>
          <Button variant="text" href={hrefFor("S00-17", here)}>
            Forgot password?
          </Button>
        </div>
        {/* Step 2: the Sign In button. */}
        <Button type="submit" disabled={busy} block>
          {busy ? "Signing in…" : "Sign In →"}
        </Button>
      </form>
      {methods.isError && (
        <p role="alert" className="text-caption text-error">
          We couldn&apos;t reach Igongo to load the sign-in options. Check your
          connection.
        </p>
      )}
    </div>
  );
}
