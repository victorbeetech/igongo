"use client";
// S00-05 Sign in on the web: one entry point for everyone. Connected to the
// API: email and password signs in for real, Google and Apple go to their
// pages and come back, and only the methods the super admin has switched on
// are shown. While the first super admin is still to be set up, the owner
// finishes the set-up here after signing in with Google.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { fetchLoginMethods, fetchSetupStatus, signInEmail, signInSocial } from "@/modules/m04-users-login/data/authApi";
import { ApiError } from "@/shared/api/ApiError";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { absoluteUrl } from "@/shared/navigation/absoluteUrl";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { useAddress } from "@/shared/navigation/useAddress";
import { ME_KEY } from "@/shared/session/useMe";
import { MY_LAYOUT_KEY } from "@/shared/session/useMyLayout";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import { FirstSetupPanel } from "./FirstSetupPanel";

/** The sign-in page. */
export function SignInPage({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  const address = useAddress();
  const client = useQueryClient();
  const methods = useQuery({ queryKey: ["login-methods"], queryFn: fetchLoginMethods });
  const setup = useQuery({ queryKey: ["setup-status"], queryFn: fetchSetupStatus });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const on = new Set(methods.data?.methods.filter((m) => m.platform === "all").map((m) => m.method));

  /** Email and password: sign in, then go home (or to the 2FA step). */
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await signInEmail(email, password);
      await client.invalidateQueries({ queryKey: ME_KEY });
      await client.invalidateQueries({ queryKey: MY_LAYOUT_KEY });
      address.push(result.twoFactorRedirect ? hrefFor("S00-16", here) : "/home");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (methods.isPending) return <SkeletonList />;
  return (
    <div className="grid gap-3 p-4">
      <p className="text-caption text-muted">Staff, riders and guests all sign in here.</p>
      {setup.data?.needed && <FirstSetupPanel />}
      {/* Step 1: email and password, when switched on. */}
      {on.has("email_password") && (
        <form onSubmit={submit} className="grid gap-3">
          <TextInput label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" hint="name@example.com" required />
          <TextInput label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
          {error && <p role="alert" className="text-caption text-error">{error}</p>}
          <Button type="submit" disabled={busy} block>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
      )}
      <div className="flex items-center gap-2 text-caption text-muted"><hr className="flex-1 border-line" />or<hr className="flex-1 border-line" /></div>
      {/* Step 2: the other switched-on methods. */}
      {on.has("google") && <Button variant="secondary" block onClick={() => void signInSocial("google", absoluteUrl("/home")).catch((e: unknown) => setError(e instanceof ApiError ? e.message : String(e)))}>Continue with Google</Button>}
      {on.has("apple") && <Button variant="secondary" block onClick={() => void signInSocial("apple", absoluteUrl("/home"))}>Continue with Apple</Button>}
      {(on.has("phone_sms") || on.has("phone_whatsapp")) && <Button variant="secondary" href={hrefFor("S00-10", here)} block>Phone number (SMS or WhatsApp)</Button>}
      {methods.isError && <p role="alert" className="text-caption text-error">We couldn&apos;t reach Igongo to load the sign-in options. Check your connection.</p>}
      {/* Step 3: guest sign-up, when the hotel allows it. */}
      {methods.data?.allowSelfRegistration && <Button variant="text" href={hrefFor("S00-18", here)}>New guest? Create an account</Button>}
      <Button variant="text" href={hrefFor("S00-17", here)}>Forgot password?</Button>
    </div>
  );
}
